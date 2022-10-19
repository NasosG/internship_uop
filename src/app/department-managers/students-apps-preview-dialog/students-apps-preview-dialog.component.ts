import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Utils} from 'src/app/MiscUtils';


@Component({
  selector: 'app-students-apps-preview-dialog',
  templateUrl: './students-apps-preview-dialog.component.html',
  styleUrls: ['./students-apps-preview-dialog.component.css']
})
export class StudentsAppsPreviewDialogComponent implements OnInit {

  public dateOfBirth: string = Utils.reformatDateOfBirth(this.data.studentsData[this.data.index].schacdateofbirth);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<StudentsAppsPreviewDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void { }

}
