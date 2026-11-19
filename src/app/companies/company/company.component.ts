import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from '../company.model';
import { CompanyService } from '../company.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, AfterViewInit {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  company!: Company;
  fontSize: number = 100;
  private language!: string;

  constructor(public router: Router, public authService: AuthService, public companyService: CompanyService, public translate: TranslateService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');
    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  /** The sidebar of AdminLTE collapses itself on narrow screens (to the column of icons) only if its menu button already
   *  exists when the page finishes loading; on fast loads (e.g. on iPhones) this layout is drawn later and the sidebar
   *  stayed hidden, leaving an empty white column. Starting it here does what AdminLTE does on load (and nothing if it
   *  has already done it). */
  ngAfterViewInit(): void {
    ($('[data-widget="pushmenu"]') as any).PushMenu?.();
  }

  ngOnInit(): void {
    this.language = localStorage.getItem('language') || 'gr';
    this.companyService.getProviderById()
      .subscribe((company: Company) => {
        this.company = company;
        console.log(this.company);
      });
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

  onDarkModeSwitched() { }

  onLogout() {
    this.authService.logout();
  }

  homeScreen() {
    return this.router.url === '/companies/' + this.authService.getSessionId();
  }

  isPositionUploaded() {
    return this.router.url === '/companies/students-positions/' + this.authService.getSessionId() + '/upload';
  }

  isPositionUploadedDisplay() {
    return this.router.url === '/companies/students-positions/' + this.authService.getSessionId();
  }

  isStudentApplications() {
    return this.router.url === '/companies/students-applications/' + this.authService.getSessionId();
  }

  isSelectedStudentsRoute() {
    return this.router.url === '/companies/selected-students/' + this.authService.getSessionId();
  }

  isContactRoute() {
    return this.router.url === '/companies/contact/' + this.authService.getSessionId();
  }

  isAboutRoute() {
    return this.router.url === '/companies/about'
  }

  isManualsRoute() {
    return this.router.url === '/companies/manuals';
  }

}
