import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentLoginTermsDialogComponent } from '../student-login-terms-dialog/student-login-terms-dialog.component';
import { StudentsService } from '../../students/student.service';
import { Router } from '@angular/router';

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
            this.router.navigateByUrl('/student/' + this.authService.getSessionId());
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
