import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { OfficeUser } from '../office-user.model';
import { OfficeService } from '../office.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit, AfterViewInit {
  officeUserData!: OfficeUser;

  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  fontSize: number = 100;
  private language!: string;

  constructor(public router: Router, private route: ActivatedRoute, public authService: AuthService, public translate: TranslateService, public officeService: OfficeService) {
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

    if (!environment.production) {
      this.authService.setSessionId(12);
      this.officeService.getOfficeUser()
      .subscribe((officeUser: OfficeUser) => {
        this.officeUserData = officeUser;
        // this.officeUserData.schacdateofbirth = Utils.reformatDateOfBirth(this.officeUserData.schacdateofbirth);
      });
    }

    if (this.router.url.includes('/office/login')) {
      this.route.queryParams
        .subscribe(params => {
          //console.log(params);
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
        }
      );

      this.router.navigateByUrl('/office/positions-add/' + this.authService.getSessionId());
    }

    this.officeService.getOfficeUser()
      .subscribe((officeUser: OfficeUser) => {
        this.officeUserData = officeUser;
        // this.officeUserData.schacdateofbirth = Utils.reformatDateOfBirth(this.officeUserData.schacdateofbirth);
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

  onDarkModeSwitched() { }

  isPositionsAddRoute() {
    return this.router.url === '/office/positions-add/' + this.authService.getSessionId();
  }

  isOfficeHomeRoute(){
    return this.router.url === '/office/' + this.authService.getSessionId();
  }

  isStatsAddRoute() {
    return this.router.url === '/office/stats/' + this.authService.getSessionId();
  }

  isContactRoute() {
    return this.router.url === '/office/contact';
  }

  isAboutRoute() {
    return this.router.url === '/office/about';
  }

  isManualsRoute() {
    return this.router.url === '/office/manuals';
  }

  isSheetInputRoute() {
    return this.router.url === '/office/sheet-input/' + this.authService.getSessionId();
  }

  isSheetOutputRoute() {
    return this.router.url === '/office/sheet-output/' + this.authService.getSessionId();
  }

  isStudentContractsRoute() {
    return this.router.url === '/office/student-contracts/' + this.authService.getSessionId();
  }

  isAtlasPositionsRoute() {
    return this.router.url === '/office/atlas-positions/' + this.authService.getSessionId();
  }

  isPaymentOrdersRoute() {
    return this.router.url === '/office/payment-orders/' + this.authService.getSessionId();
  }

  isQuestionnairesRoutes() {
    return this.router.url === '/office/questionnaires/' + this.authService.getSessionId();
  }
}
