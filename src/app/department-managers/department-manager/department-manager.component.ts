import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { environment } from 'src/environments/environment';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { Period } from '../period.model';

@Component({
  selector: 'app-department-manager',
  templateUrl: './department-manager.component.html',
  styleUrls: ['./department-manager.component.css']
})
export class DepartmentManagerComponent implements OnInit, OnDestroy, AfterViewInit {

  public depManagerData!: DepManager;
  private studentSubscription!: Subscription;
  fontSize: number = 100;
  private language!: string;
  public espaPositions!: number;
  periodSet!: boolean;
  period!: Period;
  public managesOnlyOneAcademic!: boolean;

  constructor(public depManagerService: DepManagerService, private router: Router, private route: ActivatedRoute, public authService: AuthService, public translate: TranslateService) {
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

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    // this.authService.login('costas', 'depmanager')
    //   .subscribe((response) => {
    //     this.authService.setToken(response.token);
    //     this.authService.setSessionId(response.userId);
    //   });

    if (!environment.production) {
      this.authService.setSessionId(9);
      // this.depManagerService.getDepManager()
      //   .subscribe((depManager: DepManager) => {
      //     this.depManagerData = depManager;
      //     this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
      //   });
      //   return;
      // this.depManagerService.getManagedAcademics()
      //   .subscribe((data: any) => {
      //     this.managesOnlyOneAcademic = data.length == 1;
      //     if (data.length == 1 || this.router.url !== '/department-manager/choose-dept/' + this.authService.getSessionId()) {
      //       this.router.navigateByUrl('/department-manager/' + this.authService.getSessionId());
      //     } else if (data.length > 1) {
      //       this.router.navigateByUrl('/department-manager/choose-dept/' + this.authService.getSessionId());
      //     }
      // });
    }

    if (this.router.url.includes('/department-manager/login')) {
      this.route.queryParams
        .subscribe(params => {
          //console.log(params);
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
        }
      );

    // PROD: TO BE TESTED
    this.depManagerService.getManagedAcademics()
      .subscribe((data: any) => {
        this.managesOnlyOneAcademic = data.length == 1;
        if (data.length == 1) {
          this.router.navigateByUrl('/department-manager/' + this.authService.getSessionId());
        } else if (data.length > 1) {
          this.router.navigateByUrl('/department-manager/choose-dept/' + this.authService.getSessionId());
        }
      });

      //this.router.navigateByUrl('/department-manager/' + this.authService.getSessionId());
    }

    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);

        this.depManagerService.getPeriodByDepartmentId(this.depManagerData.department_id)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                console.error(error);
                this.periodSet = false;
                return throwError(error);
              })
            )
            .subscribe((periodData: Period) => {
              this.espaPositions = periodData.positions;
              this.period = periodData;
              this.periodSet = true;
            });
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

  /** Small screens (below 768px): the flag of the chosen language instead of the globe and "Language" */
  get langFlag(): string {
    return (this.translate.currentLang || localStorage.getItem('language')) === 'en' ? 'assets/images/englishIcon.png' : 'assets/images/greeceIcon.png';
  }

  /** Small screens, sun / moon menu: switches the theme through the switch of the wide screens (hidden on small ones),
   *  so that the dark mode logic stays in one place (script.js) */
  setTheme(mode: 'light' | 'dark') {
    const themeSwitch = document.getElementById('ChangeTheme') as HTMLInputElement | null;
    if (!themeSwitch || document.body.classList.contains('dark-mode') === (mode === 'dark')) return;
    themeSwitch.checked = mode === 'dark';
    themeSwitch.dispatchEvent(new Event('change'));
  }

  /** Small screens (below 768px): the initials instead of the full name, e.g. "jason" "statham" -> "JS"
   *  (capitals; Greek names without accents) */
  initials(...names: (string | null | undefined)[]): string {
    return names.map(name => (name || '').trim().charAt(0)).join('').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
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

  isStudentsApplicationsResults() {
    return this.router.url === '/department-manager/student-applications/results/' + this.authService.getSessionId();
  }

  isSheetInputRoute() {
    return this.router.url === '/department-manager/sheet-input/' + this.authService.getSessionId();
  }

  isSheetOutputRoute() {
    return this.router.url === '/department-manager/sheet-output/' + this.authService.getSessionId();
  }

  isStudentContractsRoute() {
    return this.router.url === '/department-manager/student-contracts/' + this.authService.getSessionId();
  }

  isStudentAppsResultsOldPeriodsRoute() {
    return this.router.url === '/department-manager/student-applications/results-old/' + this.authService.getSessionId();
  }

  isAtlasPositionsRoute() {
    return this.router.url === '/department-manager/atlas-positions/' + this.authService.getSessionId();
  }

  isPaymentOrdersRoute() {
    return this.router.url === '/department-manager/payment-orders/' + this.authService.getSessionId();
  }

  isQuestionnairesRoutes() {
    return this.router.url === '/department-manager/questionnaires/' + this.authService.getSessionId();
  }
}
