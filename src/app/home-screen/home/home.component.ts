import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
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
