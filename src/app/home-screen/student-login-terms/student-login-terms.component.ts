import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentLoginTermsDialogComponent } from '../student-login-terms-dialog/student-login-terms-dialog.component';

@Component({
  selector: 'app-student-login-terms',
  templateUrl: './student-login-terms.component.html',
  styleUrls: ['./student-login-terms.component.css']
})
export class StudentLoginTermsComponent implements OnInit {
 @ViewChild('ssoLoginForm') ssoLoginForm: any;

 constructor(public dialog: MatDialog, public authService: AuthService) { }

  openDialog() {
    const dialogRef = this.dialog.open(StudentLoginTermsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void { }

  onSSOLogin(formData: any) {
    // this.authService.ssoTestLogin().subscribe((obj: Object) => {
    //   console.log(obj);
    // });
    window.location.href = 'http://praktiki-new.uop.gr:3000/CAS/CASapi.php/'
    // $('#ssoLoginForm').attr("action", "https://sso.uop.gr/login?service=https%3A%2F%2Fpraktiki.uop.gr%2Fcas%3Fdestination%3Diamstudent");
    //$('#ssoLoginForm').attr("action", "http://praktiki-new.uop.gr:3000/CAS/CASapi.php/");
    // $('#ssoLoginForm').submit();
  }
}
