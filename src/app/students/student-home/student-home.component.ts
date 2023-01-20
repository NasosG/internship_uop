import { Component, OnInit } from '@angular/core';
// import {flatMap, interval, mergeMap, takeWhile} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from 'src/app/department-managers/period.model';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { Utils } from '../../MiscUtils'
import * as moment from 'moment';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  studentsSSOData!: Student[];
  period!: Period;
  dateFrom!: string;
  dateTo!: string;
  selected: Date | null | undefined;
  comment: any;

  phaseArray = ["no-state", "STUDENT.PHASE-1", "STUDENT.PHASE-2", "STUDENT.PHASE-3"];
  isDeclarationEnabled: boolean|undefined;
  areOptionsEnabled: boolean|undefined;

  private INTEREST_EXPRESSION_PHASE: number = 1;
  private STUDENT_SELECTION_PHASE: number = 2;
  private PREFERENCE_DECLARATION_PHASE: number = 3;

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;

        this.studentsService.getPhase(this.studentsSSOData[0]?.department_id)
          .subscribe((period: Period) => {
            this.period = period;
            this.dateFrom = Utils.reformatDateToEULocaleStr(this.period.date_from);
            this.dateTo = Utils.reformatDateToEULocaleStr(this.period.date_to);
            const isPeriodDateActive = moment(new Date()).isSameOrBefore(period.date_to, 'day')

            this.isDeclarationEnabled = period.is_active && period.phase_state == this.INTEREST_EXPRESSION_PHASE && isPeriodDateActive;
            this.areOptionsEnabled = period.is_active && period.phase_state > this.PREFERENCE_DECLARATION_PHASE && this.studentsSSOData[0].phase > 1 && isPeriodDateActive;
          });

        this.studentsService.getCommentByStudentIdAndSubject(this.studentsSSOData[0]?.sso_uid, 'Δικαιολογητικά')
          .subscribe((comment: any) => {
            this.comment = comment;
          });
      });
    //   const source = this.studentsService
    // .getStudents()
    // .pipe(
    //     mergeMap(result => this.studentsService.getPhase(result[0]?.department_id))
    //  )
    // .subscribe((period: Period) => {
    //   console.log("asd");
    //       this.period = period;
    //       this.dateFrom = this.reformatDate(this.period.date_from);
    //       this.dateTo = this.reformatDate(this.period.date_to);
    //     });
  }
}
