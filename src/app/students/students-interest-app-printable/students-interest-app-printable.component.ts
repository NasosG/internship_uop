import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import {Period} from 'src/app/department-managers/period.model';
import {Student} from '../student.model';
import {StudentsService} from '../student.service';


@Component({
  selector: 'app-students-interest-app-printable',
  templateUrl: './students-interest-app-printable.component.html',
  styleUrls: ['./students-interest-app-printable.component.css']
})
export class StudentsInterestAppPrintableComponent implements OnInit {
  studentsSSOData: any;
  period!: Period;
  studentFiles!: any[];

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void {
     this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
           this.studentsService.getPhase(this.studentsSSOData[0]?.department_id)
          .subscribe((period: Period) => {
            // Fetch protocol number if interest app for this period exists
            this.studentsService.getProtocolNumberIfInterestAppExists(period.id)
              .subscribe((response: any) => {
                if (response.protocolNumber) {
                  this.studentsSSOData[0].latest_app_protocol_number = response.protocolNumber;
                }

              this.studentsService.getStudentFilesForAppPrint()
                .subscribe((files: any[]) => {
                  console.log(files);
                  this.studentFiles = files;
                });

              });
          });
      });
  }

  calculateCurrYear(): string {
    return `${(new Date().getFullYear() - 1)} - ${ new Date().getFullYear()}`;
  }

}
