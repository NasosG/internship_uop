import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepManagerService } from '../dep-manager.service';

@Component({
  selector: 'app-student-files-view-dialog',
  templateUrl: './student-files-view-dialog.component.html',
  styleUrls: ['./student-files-view-dialog.component.css']
})
export class StudentFilesViewDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<StudentFilesViewDialogComponent>,
    public depManagerService: DepManagerService
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  receiveFile(studentId: number, docType: string) {
    // this.depManagerService.receiveFile();
    this.depManagerService.receiveFile(studentId, docType).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

}
