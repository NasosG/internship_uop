import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-manager',
  templateUrl: './department-manager.component.html',
  styleUrls: ['./department-manager.component.css']
})
export class DepartmentManagerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  isDepartmentMangerRoute() {
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

  isContactRoute() {
    return this.router.url === '/department-manager/contact'
  }
}
