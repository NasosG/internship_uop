import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy {

  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  studentsSSOData: Student[] = [];
  private studentSubscription!: Subscription;
  fontSize: number =  100;
  private language!: string;

  constructor(public studentsService: StudentsService, private router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    this.authService.login('pcst19003');
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].schacdateofbirth = this.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
        this.studentsSSOData[0].schacpersonaluniqueid = this.getSSN(this.studentsSSOData[0].schacpersonaluniqueid);
        // console.log(this.studentsSSOData);
      });
    // this.studentSubscription = this.studentsService.getStudentUpdateListener()
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
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

  onLogout() {
    this.authService.logout();
  }

  changeFont(operator: string) {
    operator === '+' ? this.fontSize+=10 : this.fontSize-=10; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    if (this.fontSize >= 200) this.fontSize = 200;
    else if (this.fontSize <= 70) this.fontSize = 70;

     document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  resetFont() {
    this.fontSize = 100; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  changeLang(language: string) {
    //alert('yes it is ' + language);
    localStorage.setItem('language', language);
    window.location.reload();
  }

  onDarkModeSwitched() { }

  isProfileRoute() {
    return this.router.url === '/student/profile/' + this.authService.getSessionId();
  }

  isStudentRoute() {
    return this.router.url === '/student/' + this.authService.getSessionId();
  }

  isInternshipRoute() {
    return this.router.url === '/student/myinternship/' + this.authService.getSessionId();
  }

  isPositionsRoute() {
    return this.router.url === '/student/positions/' + this.authService.getSessionId();
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

  isStudentContractRoute() {
    return this.router.url === '/student/student-contract'
  }

  isEvaluationSheetRoute() {
    return this.router.url === '/student/evaluation-form'
  }
}
