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

  isDepartmentMangerRoute(){
    return this.router.url === '/department-manager';
  }
}
