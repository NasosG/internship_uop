import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout'
import { Observable, Subscription, takeUntil } from 'rxjs';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy {

  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();




  isProfileRoute() {
    return this.router.url === '/student/profile';
  }

  isStudentRoute() {
    return this.router.url === '/student';
  }

  isInternshipRoute() {
    return this.router.url === '/student/myinternship';
  }

  isPositionsRoute() {
    return this.router.url === '/student/positions';
  }

  isAboutRoute() {
    return this.router.url === '/student/about';
  }

  isManualsRoute() {
    return this.router.url === '/student/manuals';
  }

  isCalendarRoute() {
    return this.router.url === '/student/calendar';
  }

  isSheetsRoute() {
    return this.router.url === '/student/sheets';
  }

  isSheetInputRoute() {
    return this.router.url === '/student/input-sheet';
  }

  isSheetOutputRoute() {
    return this.router.url === '/student/output-sheet';
  }

  isSheetInputPreviewRoute() {
    return this.router.url === '/student/input-sheet-preview';
  }

  isContactRoute() {
    return this.router.url === '/student/contact'
  }

  onDarkModeSwitched() {}

  studentsSSOData: Student[] = [];
  private studentSubscription!: Subscription;

  constructor(public studentsService: StudentsService, private router: Router, private breakpointObserver: BreakpointObserver) { }

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
  private getSSN(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
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
