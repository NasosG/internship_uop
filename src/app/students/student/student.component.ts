import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from 'src/app/MiscUtils';
import { Period } from 'src/app/department-managers/period.model';
import { StudentCommentsDialogComponent } from '../student-comments-dialog/student-comments-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment/moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit, OnDestroy {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  public studentsSSOData: Student[] = [];
  private studentSubscription!: Subscription;
  fontSize: number = 100;
  private language!: string;
  period!: Period;
  dateFrom!: string;
  dateTo!: string;
  isDeclarationEnabled!: boolean;
  areOptionsEnabled!: boolean;
  private INTEREST_EXPRESSION_PHASE: number = 1;
  private STUDENT_SELECTION_PHASE: number = 2;
  private PREFERENCE_DECLARATION_PHASE: number = 3;
  public comment: any;

  constructor(public studentsService: StudentsService, private router: Router, private route: ActivatedRoute,
    public authService: AuthService, public translate: TranslateService, public dialog: MatDialog) {

    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  async ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    if (!environment.production) {
      this.authService.setSessionId(1);
      // this.studentsService.getStudents()
      //   .subscribe((student: Student[]) => {
      //     this.studentsSSOData = student;
      //     this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
      //   });
        // return;
    }

    if (this.router.url.includes('/student/login')) {
      this.route.queryParams
        .subscribe(params => {
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
        }
      );

      this.router.navigate(['/student/' + this.authService.getSessionId()]);
    }

    this.fetchStudentAndPeriod();
  }

  // ngAfterViewInit(): void { }

  public fetchStudentAndPeriod() {
    //this.authService.login('pcst19003')
      //.subscribe((response) => {
        //this.authService.setToken(response.token);
        //this.authService.setSessionId(response.userId);
       // console.log(response);
        this.studentsService.getStudents()
          .subscribe((students: Student[]) => {
            this.studentsSSOData = students;
            this.studentsSSOData[0].schacdateofbirth = Utils.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
            this.studentsSSOData[0].user_ssn = this.getSSN(this.studentsSSOData[0].user_ssn);
            this.studentsService.getPhase(this.studentsSSOData[0]?.department_id)
              .subscribe((period: Period) => {
                this.period = period;
                this.dateFrom = Utils.reformatDateToEULocaleStr(this.period.date_from);
                this.dateTo = Utils.reformatDateToEULocaleStr(this.period.date_to);
                this.isDeclarationEnabled = period.is_active && period.phase_state == this.INTEREST_EXPRESSION_PHASE;
                this.areOptionsEnabled = period.is_active && period.phase_state > this.PREFERENCE_DECLARATION_PHASE && this.studentsSSOData[0].phase > 1;
              });
            this.studentsService.getCommentByStudentIdAndSubject(this.studentsSSOData[0]?.sso_uid, 'Δικαιολογητικά')
              .subscribe((comment: any) => {
                this.comment = comment;
                const dateDif = moment(comment.comment_date, "YYYY-MM-DD HH:mm:ss").locale("el").fromNow();
                this.comment.comment_date = dateDif;
              });
          });
      //});
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
  }

  // This function is used to get the AMKA of the student
  private getSSN(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  onLogout() {
    this.authService.logout();
  }

  changeFont(operator: string) {
    operator === '+' ? this.fontSize += 10 : this.fontSize -= 10; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    if (this.fontSize >= 200) this.fontSize = 200;
    else if (this.fontSize <= 70) this.fontSize = 70;

    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  resetFont() {
    this.fontSize = 100; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  changeLang(language: string) {
    localStorage.setItem('language', language);
    // window.location.reload();
    this.translate.use(language);
  }

  openCommentsDialog() {
    const dialogRef = this.dialog.open(StudentCommentsDialogComponent, {
      data: { studentsData: this.studentsSSOData, index: 0 }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
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
    return this.router.url === '/student/sheets/' + this.authService.getSessionId();
  }

  isSheetInputRoute() {
    return this.router.url === '/student/sheets/input-sheet/' + this.authService.getSessionId();
  }

  isSheetOutputRoute() {
    return this.router.url === '/student/sheets/output-sheet/' + this.authService.getSessionId();
  }

  isSheetInputPreviewRoute() {
    return this.router.url === '/student/sheets/input-sheet-preview/' + this.authService.getSessionId();
  }

  isContactRoute() {
    return this.router.url === '/student/contact'
  }

  isStudentContractRoute() {
    return this.router.url === '/student/student-contract'
  }

  isEvaluationSheetRoute() {
    return this.router.url === '/student/sheets/evaluation-form/' + this.authService.getSessionId()
  }

  isPracticeEnableRoute() {
    return this.router.url === '/student/enable_intern/' + this.authService.getSessionId();
  }

  isStudentCompanyAcceptRoute() {
    return this.router.url === '/student/company-accept/' + this.authService.getSessionId();
  }
}
