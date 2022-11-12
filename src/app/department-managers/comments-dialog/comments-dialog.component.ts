import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DepManagerService} from '../dep-manager.service';

@Component({
  selector: 'app-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.css']
})
export class CommentsDialogComponent implements OnInit {
  @ViewChild('commentsArea') commentsArea!: ElementRef;
  comment!: any;
  commentExistsInDatabase = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<CommentsDialogComponent>, public depManagerService: DepManagerService
  ) { }

  onCommentSubmit(): void {
    // get value from html element
    const comments = this.commentsArea.nativeElement.value;

    // check if comments is null or empty or whiteSpace
    if (comments === null || comments === '' || comments.trim() === '') {
      alert('Το σχόλιο δεν μπορεί να είναι κενό');
      return;
    }

    if (this.commentExistsInDatabase) {
      // update comment
      this.depManagerService.updateCommentsByStudentId(this.data.studentsData[this.data.index].uuid, comments);
    } else {
      // insert comment
      this.depManagerService.insertCommentsByStudentId(this.data.studentsData[this.data.index].uuid, comments);
    }

    this.dialogRef.close();
  }

  ngOnInit(): void {
    const subject = "Δικαιολογητικά";
    this.depManagerService.getCommentByStudentIdAndSubject(this.data.studentsData[this.data.index].uuid, subject)
      .subscribe((comment: any) => {
        if (comment) {
          this.comment = comment;
          this.commentsArea.nativeElement.value = this.comment.comment_text;
          this.commentExistsInDatabase = true;
        }
      });
  }

}
