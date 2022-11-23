import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from 'src/app/department-managers/period.model';
import { Application } from '../application.model';
import { StudentPositions } from '../student-positions.model';
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
  assignments!: any;

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    // get assignment by student id
    this.studentsService.getAssignmentsByStudentId()
      .subscribe((assignments: any) => {
        console.log(assignments)
        this.assignments = assignments;
      });
  }

}
