import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { OfficeUser } from '../office-user.model';
import { OfficeService } from '../office.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit {
  officeUserData!: OfficeUser;

  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  fontSize: number = 100;
  private language!: string;

  constructor(public router: Router, public authService: AuthService, public translate: TranslateService, public officeService: OfficeService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');
    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  ngOnInit(): void {
    this.language = localStorage.getItem('language') || 'gr';
    // this.companyService.getProviderById()
    //   .subscribe((company: Company) => {
    //     this.company = company;
    //     console.log(this.company);
    //   });

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

  onDarkModeSwitched() { }

  isPositionsAddRoute() {
    return this.router.url === '/office/positions-add';
  }

  isStatsAddRoute() {
    return this.router.url === '/office/stats';
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

}








