import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from 'src/app/department-managers/period.model';
import { AcceptedAssignmentsByCompany } from '../accepted-assignments-by-company';
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
  assignments!: AcceptedAssignmentsByCompany[];
  positionAssigned: boolean = false;
  positionAssignedIndex: number = 0;

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    // get assignment by student id
    this.studentsService.getAssignmentsByStudentId()
      .subscribe((assignments: AcceptedAssignmentsByCompany[]) => {
        console.log(assignments)
        this.assignments = assignments;

        // set appAssigned to true there is approval_state = 1 in any record of this.assignments
        for (let assignment of this.assignments) {
          if (assignment.approval_state == 1) {
            this.positionAssigned = true;
            this.positionAssignedIndex = this.assignments.indexOf(assignment);
            break;
          }
        }

      });
  }

  acceptCompanyPosition(positionIndex: number) {
    let assignment = this.assignments[positionIndex];
    this.studentsService.acceptCompanyPosition(assignment)
      .subscribe((response: any) => {
        console.log(response);
      });
  }

}
