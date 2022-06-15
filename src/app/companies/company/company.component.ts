import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {Company} from '../company.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  company!: Company;

  constructor(public router: Router, public authService: AuthService, public companyService: CompanyService) { }

  ngOnInit(): void {
      this.companyService.getProviderById()
          .subscribe((company: Company) => {
            this.company = company;
            console.log(this.company);
        });
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

}
