import { Component, OnInit} from '@angular/core';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from 'src/app/department-managers/period.model';
import Swal from 'sweetalert2';
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

  acceptCompanyPositionAlert(positionIndex: number) {
    Swal.fire({
      title: 'Είστε σίγουρος/η για την αποδοχή της θέσης εργασίας;',
      text: 'Η επιλογή είναι οριστική και δεν μπορεί να αναιρεθεί.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, αποδέχομαι',
      cancelButtonText: 'Όχι, ακύρωση'
    }).then((result) => {
      // if user clicks on confirmation button, call acceptPosition() method
      if (result.isConfirmed) {
        this.acceptCompanyPosition(positionIndex);
      }
    });
  }

  acceptCompanyPosition(positionIndex: number) {
    let assignment = this.assignments[positionIndex];
    this.studentsService.acceptCompanyPosition(assignment)
      .pipe(
        catchError((error: any) => {
          console.error(error);
          Swal.fire({
            title: 'Αποτυχία',
            text: 'Ανεπιτυχής ανάθεση της θέσης με κωδικό group: ' + assignment.position_id,
            icon: 'error'
          });
          return of(null);
        }))
      .subscribe((response: any) => {
          if (response) {
            console.log(response);
            Swal.fire({
              title: 'Επιτυχία',
              text: 'Eπιτυχής ανάθεση της θέσης με κωδικό group: ' + assignment.position_id,
              icon: 'success'
            }).then(() => {
              location.reload();
            });
          }
        });
  }

}
