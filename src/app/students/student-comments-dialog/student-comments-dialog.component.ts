import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-student-comments-dialog',
  templateUrl: './student-comments-dialog.component.html',
  styleUrls: ['./student-comments-dialog.component.css']
})
export class StudentCommentsDialogComponent implements OnInit {
  @ViewChild('commentsArea') commentsArea!: ElementRef;
  comment!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<StudentCommentsDialogComponent>, public studentsService: StudentsService
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const subject = "Δικαιολογητικά";
    this.studentsService.getCommentByStudentIdAndSubject(this.data.studentsData[this.data.index].uuid, subject)
      .subscribe((comment: any) => {
        this.comment = comment;
        this.commentsArea.nativeElement.value = this.comment.comment_text;
      });
  }

}
