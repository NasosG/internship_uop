import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {Assignment} from 'src/app/companies/assignment.model';
import { Period } from 'src/app/department-managers/period.model';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import {Application} from '../application.model';
import { AtlasFilters } from '../atlas-filters.model';
import { AtlasPosition } from '../atlas-position.model';
import { City } from '../city.model';
import { Department } from '../department.model';
import {StudentPositions} from '../student-positions.model';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-student-company-accept',
  templateUrl: './student-company-accept.component.html',
  styleUrls: ['./student-company-accept.component.css']
})
export class StudentCompanyAcceptComponent implements OnInit {

  studentPositions!: StudentPositions[];
  studentApplications!: Application[];
  studentsData!: Student[];
  studentName!: string;
  period!: Period;
  dateFrom!: string;
  dateTo!: string;
  assignments!: any[];

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsData = students;
        // get assignment by student id
        this.studentsService.getAssignmentsByStudentId()
          .subscribe((assignments: any[]) => {
            this.assignments = assignments;
          });
      });
  }

}
