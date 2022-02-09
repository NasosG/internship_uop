import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { Observable, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit, OnDestroy {

  // studentsSSOData!:Student[];
  studentsSSOData: Student[] = [];
  public name = "asd";
  private studentSubscription!: Subscription;

  // students!: Observable<any>;
  constructor(public studentsService: StudentsService) { }

  ngOnInit() {
    this.studentsService.getStudents()
    .subscribe((students: Student[]) => {
      this.studentsSSOData = students;
      console.log(this.studentsSSOData);
      console.log(students);
    });
    // this.studentSubscription = this.studentsService.getStudentUpdateListener()
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
  }

}
