import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentLoginTermsDialogComponent } from '../student-login-terms-dialog/student-login-terms-dialog.component';
import { StudentsService } from '../../students/student.service';
import { Router } from '@angular/router';
import { DepManagerService } from 'src/app/department-managers/dep-manager.service';

@Component({
  selector: 'app-student-login-terms',
  templateUrl: './student-login-terms.component.html',
  styleUrls: ['./student-login-terms.component.css']
})
export class StudentLoginTermsComponent implements OnInit {
  @ViewChild('ssoLoginForm') ssoLoginForm: any;
  @ViewChild('termsCheckbox') termsCheckbox: any;
  private isTermsCheckBoxChecked: boolean = false;

  constructor(public dialog: MatDialog, public authService: AuthService, private router: Router, public studentsService: StudentsService) { }

  openDialog() {
    const dialogRef = this.dialog.open(StudentLoginTermsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void { }

  onTermsAcceptanceSubmit(formData: any) {
    if (this.isTermsCheckBoxChecked) {
      this.studentsService.insertStudentTermsAcceptance(this.isTermsCheckBoxChecked)
        .subscribe((response: any) => {
          if (response.message === 'User acceptance updated/inserted successfully') {
            this.studentsService.getMergedDepartmentInfoByStudentId()
              .subscribe((departments: any) => {
                if (departments.length == 1) {
                  // If student has only one department, no need to choose
                  this.router.navigateByUrl('/student/' + this.authService.getSessionId());
                } else if (departments.length > 1) {
                  // If student has more than one department, he/she must choose
                  this.router.navigateByUrl('/student/choose-dept/' + this.authService.getSessionId());
                }
              });
          }
        });
    }
  }

  onCheckboxChange(event: any) {
    this.isTermsCheckBoxChecked = event.target.checked;
  }

  // onSSOLogin(formData: any) {
  //   window.location.href = 'http://praktiki-new.uop.gr:3000/CAS/CASapi.php/'
  // }
}
