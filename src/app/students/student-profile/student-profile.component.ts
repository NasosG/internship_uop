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

  studentsSSOData: Student[] = [];
  private studentSubscription!: Subscription;

  constructor(public studentsService: StudentsService) { }

  ngOnInit() {
    this.studentsService.getStudents()
    .subscribe((students: Student[]) => {
      this.studentsSSOData = students;
      this.studentsSSOData[0].schacdateofbirth = this.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
      this.studentsSSOData[0].schacpersonaluniqueid = this.getSSN(this.studentsSSOData[0].schacpersonaluniqueid);
      // console.log(this.studentsSSOData);
    });
    // this.studentSubscription = this.studentsService.getStudentUpdateListener()
  }

  // This function is used to get the AMKA of the student
  private getSSN(str: string) : string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length-1];
  }

  private reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;

    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);

    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
  }

}
