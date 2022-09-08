import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-student-login-terms-dialog',
  templateUrl: './student-login-terms-dialog.component.html',
  styleUrls: ['./student-login-terms-dialog.component.css']
})
export class StudentLoginTermsDialogComponent implements OnInit {

  ngOnInit(): void { }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<StudentLoginTermsDialogComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

}
