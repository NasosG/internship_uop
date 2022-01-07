import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
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
}
