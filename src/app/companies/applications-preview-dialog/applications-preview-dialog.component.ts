import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-applications-preview-dialog',
  templateUrl: './applications-preview-dialog.component.html',
  styleUrls: ['./applications-preview-dialog.component.css']
})
export class ApplicationsPreviewDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<ApplicationsPreviewDialogComponent>
  ) { }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
