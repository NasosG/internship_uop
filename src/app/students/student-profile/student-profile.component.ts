import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit, OnDestroy {

  @Input() studentsSSOData:Student[] = [];

  constructor(public studentsService: StudentsService) {
  }

  public stid = "";
  private studentSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.studentsService.getStudents();
    this.studentSubscription = this.studentsService.getStudentUpdateListener()
    .subscribe(
      (students:Student[]) => {
        this.studentsSSOData = students;
        // this.studentsSSOData[0].name = students[0].name;
        // console.log("studentsSSOData: " + this.studentsSSOData);
        // console.log(students);
      }
    )

  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
  }

}
