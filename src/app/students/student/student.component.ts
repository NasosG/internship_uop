import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout'

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();
  constructor(private router: Router, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void { }

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
}
