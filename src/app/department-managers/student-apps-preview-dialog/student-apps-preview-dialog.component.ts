import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { BankUtils } from 'src/app/BankUtils';

@Component({
  selector: 'app-student-apps-preview-dialog',
  templateUrl: './student-apps-preview-dialog.component.html',
  styleUrls: ['./student-apps-preview-dialog.component.css']
})
export class StudentAppsPreviewDialogComponent implements OnInit {
  public bank: string = BankUtils.getBankNameByIBAN(this.data.studentsData[this.data.index].iban);
  public dateOfBirth: string = Utils.reformatDateOfBirth(this.data.studentsData[this.data.index].schacdateofbirth);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<StudentAppsPreviewDialogComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void { }

}
