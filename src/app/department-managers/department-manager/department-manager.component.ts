import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {Utils} from 'src/app/MiscUtils';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';

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

  constructor(public depManagerService: DepManagerService, private router: Router, public authService: AuthService, public translate: TranslateService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    // this.authService.login('');
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
      });
    // this.studentSubscription = this.studentsService.getStudentUpdateListener()
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
    return this.router.url === '/department-manager';
  }

  isPeriodAddRoute() {
    return this.router.url === '/department-manager/add-period';
  }

  isPeriodEditRoute() {
    return this.router.url === '/department-manager/edit-period';
  }

  isStudentApplications() {
    return this.router.url === '/department-manager/student-applications';
  }

  isMatchStudentsRoute() {
    return this.router.url === '/department-manager/match-students';
  }

  isStudentsAprrovedRoute() {
    return this.router.url === '/department-manager/students-approved';
  }

  isContactRoute() {
    return this.router.url === '/department-manager/contact'
  }
}
