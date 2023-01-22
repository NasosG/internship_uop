import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Department } from 'src/app/students/department.model';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';

@Component({
  selector: 'app-department-manager-login',
  templateUrl: './department-manager-login.component.html',
  styleUrls: ['./department-manager-login.component.css']
})
export class DepartmentManagerLoginComponent implements OnInit {
  public managedAcademics!: any;
  academics = new FormControl('');
  departments!: Department[];

  constructor(private depManagerService: DepManagerService, public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.depManagerService.getManagedAcademics()
      .subscribe((data: Department) => {
        this.managedAcademics = data;
      });
  }

  submitForm(form: any) {
    if (!this.academics?.value) {
        console.log("Academic value is undefined or empty");
        return;
    }
    const academicValue = this.academics?.value;
    // alert(this.academics?.value);

    // on success, update backend via http patch to update department id of department manager
    this.onSuccess(academicValue);
  }

  // on success, update department id of department manager, show swal on error
  onSuccess(academicValue: number) {
    this.depManagerService.updateStudentDepartmentId(academicValue).subscribe({
      next: data => {
        console.log('Update successful');
        this.router.navigateByUrl('/department-manager/' + this.authService.getSessionId());
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
}
