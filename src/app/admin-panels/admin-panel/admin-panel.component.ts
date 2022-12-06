import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/auth/auth.service';
import {StudentsService} from 'src/app/students/student.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  roles = new FormControl('');
  toppings = new FormControl('');
  roleList: string[] = ['Τμηματικός Υπεύθυνος', 'Γραφείο Πρακτικής Άσκησης'];
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  fontSize: number = 100;
  dateFrom!: string;
  dateTo!: string;
  isDeclarationEnabled!: boolean;
  areOptionsEnabled!: boolean;
  public comment: any;

  constructor(public studentsService: StudentsService, private router: Router, private route: ActivatedRoute,
    public authService: AuthService, public translate: TranslateService, public dialog: MatDialog) {

    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  async ngOnInit() {
    if (!environment.production) {
      this.authService.setSessionId(1);
    }

    if (this.router.url.includes('/student/login')) {
      this.route.queryParams
        .subscribe(params => {
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
        }
      );

      this.router.navigate(['/student/' + this.authService.getSessionId()]);
    }
  }

  onLogout() {
    //this.authService.logout();
  }

  changeFont(operator: string) {
    operator === '+' ? this.fontSize += 10 : this.fontSize -= 10; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    if (this.fontSize >= 200) this.fontSize = 200;
    else if (this.fontSize <= 70) this.fontSize = 70;

    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  resetFont() {
    this.fontSize = 100; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

}
