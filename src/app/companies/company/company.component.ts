import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void { }

  isStudentApplications() {
    return this.router.url === '/companies/students-applications';
  }

  isSelectedStudentsRoute() {
    return this.router.url === '/companies/selected-students';
  }

}
