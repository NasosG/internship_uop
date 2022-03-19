import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private language!: string;

  constructor(private router: Router, public translate: TranslateService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang!=null) ? browserLang : 'gr');
  }

  ngOnInit(): void {
     this.language = localStorage.getItem('language') || 'gr';
  }

  changeLang(language: string) {
    localStorage.setItem('language', language);
    // window.location.reload();
    this.translate.use(language);
  }

  isTermsRoute() {
    return this.router.url === '/terms';
  }

  isCompanyTermsRoute() {
    return this.router.url === '/company-terms';
  }

  isRoute() {
    return this.router.url === '/';
  }

  isCredentialsRoute() {
    return this.router.url === '/credentials-generic';
  }

}
