import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import {Period} from '../period.model';

@Component({
  selector: 'app-department-manager',
  templateUrl: './department-manager.component.html',
  styleUrls: ['./department-manager.component.css']
})
export class DepartmentManagerComponent implements OnInit, OnDestroy {

  public depManagerData!: DepManager;
  private studentSubscription!: Subscription;
  fontSize: number = 100;
  private language!: string;
  public espaPositions!: number;

  constructor(public depManagerService: DepManagerService, private router: Router, private route: ActivatedRoute, public authService: AuthService, public translate: TranslateService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    // this.authService.login('costas', 'depmanager')
    //   .subscribe((response) => {
    //     this.authService.setToken(response.token);
    //     this.authService.setSessionId(response.userId);
    //   });

    if (this.router.url.includes('/department-manager/login')) {
      this.route.queryParams
        .subscribe(params => {
          //console.log(params);
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
        }
      );

      this.router.navigate(['/department-manager/' + this.authService.getSessionId()]);
    }

    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
      });

    this.depManagerService.getPeriodByUserId()
      .subscribe((periodData: Period) => {
        this.espaPositions = periodData.positions;
      });
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
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

  changeLang(language: string) {
    localStorage.setItem('language', language);
    // window.location.reload();
    this.translate.use(language);
  }

  isDepartmentManagerRoute() {
    return this.router.url === '/department-manager/' + this.authService.getSessionId();
  }

  isPeriodAddRoute() {
    return this.router.url === '/department-manager/add-period/' + this.authService.getSessionId();
  }

  isPeriodEditRoute() {
    return this.router.url === '/department-manager/edit-period/' + this.authService.getSessionId();
  }

  isStudentApplications() {
    return this.router.url === '/department-manager/student-applications/' + this.authService.getSessionId();
  }

  isMatchStudentsRoute() {
    return this.router.url === '/department-manager/match-students/' + this.authService.getSessionId();
  }

  isStudentsAprrovedRoute() {
    return this.router.url === '/department-manager/students-approved/' + this.authService.getSessionId();
  }

  isAboutRoute () {
    return this.router.url === '/department-manager/about';
  }

  isContactRoute() {
    return this.router.url === '/department-manager/contact';
  }

  isManualsRoute() {
    return this.router.url === '/department-manager/manuals';
  }
}
