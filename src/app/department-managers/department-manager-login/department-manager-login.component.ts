import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/students/department.model';
import { DepManagerService } from '../dep-manager.service';

@Component({
  selector: 'app-department-manager-login',
  templateUrl: './department-manager-login.component.html',
  styleUrls: ['./department-manager-login.component.css']
})
export class DepartmentManagerLoginComponent implements OnInit {

  public managedAcademics!: any;

  constructor(private depManagerService: DepManagerService) { }

  ngOnInit(): void {
    this.depManagerService.getManagedAcademics()
      .subscribe((data: Department) => {
        this.managedAcademics = data;
      });
  }

}
