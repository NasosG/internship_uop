import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';

@Component({
  selector: 'app-students-matched-info-dialog',
  templateUrl: './students-matched-info-dialog.component.html',
  styleUrls: ['./students-matched-info-dialog.component.css']
})
export class StudentsMatchedInfoDialogComponent implements OnInit {
  public studentsData: Student|undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<StudentsMatchedInfoDialogComponent>, private studentsService: StudentsService) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.studentsService.getStudentByIdFromDialog(this.data.index).subscribe((student: Student[]) => {
      this.studentsData = student[0];
      this.studentsData.schacpersonaluniquecode = Utils.getAM(this.studentsData.schacpersonaluniquecode);
    });
  }

}
