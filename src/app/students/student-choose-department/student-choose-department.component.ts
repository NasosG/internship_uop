import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/auth/auth.service';
import { DepManagerService } from 'src/app/department-managers/dep-manager.service';
import Swal from 'sweetalert2';
import { Department } from '../department.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-student-choose-department',
  templateUrl: './student-choose-department.component.html',
  styleUrls: ['./student-choose-department.component.css']
})
export class StudentChooseDepartmentComponent implements OnInit {
  public managedAcademics!: any;
  academics = new FormControl('');
  departments!: Department[];

  constructor(private studentsService: StudentsService, public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.studentsService.getMergedDepartmentInfoByStudentId()
      .subscribe((departments: any) => {
        this.managedAcademics = departments;
    });
  }

  submitForm(form: any) {
    if (!this.academics?.value) {
        console.log("Academic value is undefined or empty");
        return;
    }
    const academicValue = this.academics?.value;
    // alert(this.academics?.value);

    // on success, update backend via http patch to update department id of student
    this.onSuccess(academicValue);
  }

  // make a swal2 alert dialog
  onSuccess(academicValue: number) {
    Swal.fire({
      title: 'Επιβεβαίωση Τμήματος',
      text: 'Είστε σίγουροι ότι ανήκετε σε αυτό το τμήμα; Αυτή η ενέργεια είναι μη αναστρέψιμη.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
        if (!result.isConfirmed) {
          console.log("User pressed Cancel or closed the popup");
        } else {
          this.studentsService.updateStudentDepartmentId(academicValue).subscribe({
            next: data => {
              console.log('Update successful');
              this.router.navigateByUrl('/student/' + this.authService.getSessionId());
            },
            error: error => {
              console.log('Error updating student department id: ', error);
              Swal.fire({
                title: 'Error',
                text: 'Υπήρξε σφάλμα κατά την επεξεργασία του αιτήματός σας. Παρακαλούμε προσπαθήστε ξανά αργότερα.',
                icon: 'error',
              });
            }
          });
        }
    });
  }

}
