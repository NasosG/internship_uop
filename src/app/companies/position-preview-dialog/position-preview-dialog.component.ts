import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-position-preview-dialog',
  templateUrl: './position-preview-dialog.component.html',
  styleUrls: ['./position-preview-dialog.component.css']
})
export class PositionPreviewDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<PositionPreviewDialogComponent>
  ) { }

  ngOnInit(): void { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
