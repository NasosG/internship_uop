import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import {Department} from 'src/app/students/department.model';
import { StudentsService } from 'src/app/students/student.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  username = new FormControl('');
  roles = new FormControl('');
  academics = new FormControl('');
  isAdmin = new FormControl('');
  roleList: string[] = ['Τμηματικός Υπεύθυνος', 'Γραφείο Πρακτικής Άσκησης'];
  fontSize: number = 100;
  dateFrom!: string;
  dateTo!: string;
  isDeclarationEnabled!: boolean;
  areOptionsEnabled!: boolean;
  public comment: any;
  departments!: Department[];

  constructor(public studentsService: StudentsService, private router: Router, private route: ActivatedRoute,
    public authService: AuthService, public translate: TranslateService, public dialog: MatDialog) {

    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  async ngOnInit() {
    this.studentsService.getAtlasInstitutions()
      .subscribe((fetchedDepartments: Department[]) => {
        this.departments = fetchedDepartments;
      });

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

  submitForm(form: any) {
    console.log(this.username?.value);
    console.log(this.academics?.value);

    // get academic.atlas_id from this.academics.values array by using this.departments array
    let arr = [];
    for (let obj of this.academics?.value) {
      const department_ids = this.departments?.find(x => x.department === obj)?.atlas_id;
      arr.push(department_ids);
    }
    console.log(arr);

    console.log(this.roles?.value);
    console.log(this.isAdmin?.value);

    let finalJson = JSON.stringify({
      "username": this.username?.value,
      "academics": arr,
      "roles": this.roles?.value,
      "isAdmin": this.isAdmin?.value
    });

    console.log(finalJson);
    // TODO: send finalJson to backend via http post to create a new user
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
