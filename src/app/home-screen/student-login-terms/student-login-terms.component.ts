import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-student-login-terms',
  templateUrl: './student-login-terms.component.html',
  styleUrls: ['./student-login-terms.component.css']
})
export class StudentLoginTermsComponent implements OnInit {

 constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void { }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
  styleUrls: ['./dialog-content.css']
})
export class DialogContentExampleDialog {

  constructor(public dialogRef: MatDialogRef<DialogContentExampleDialog>) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
