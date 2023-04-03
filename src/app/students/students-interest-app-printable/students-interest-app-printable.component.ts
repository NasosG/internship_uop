import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { Period } from 'src/app/department-managers/period.model';
import { Utils } from 'src/app/MiscUtils';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { DocTypeLabels } from '../doc-type-labels.model';

@Component({
  selector: 'app-students-interest-app-printable',
  templateUrl: './students-interest-app-printable.component.html',
  styleUrls: ['./students-interest-app-printable.component.css']
})
export class StudentsInterestAppPrintableComponent implements OnInit {
  period!: Period;
  public studentsSSOData: any;
  public studentFiles!: any[];
  public docTypeLabels: DocTypeLabels = {
    AFFIDAVIT: 'Υπεύθυνη Δήλωση',
    SSN: 'Έντυπο ΑΦΜ',
    IDENTITY: 'Έντυπο ΑΔΤ',
    IBAN: 'Έντυπο IBAN',
    AMA: 'Έντυπο ΑΜΑ'
  };

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void {
     this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].schacdateofbirth = Utils.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
        this.studentsSSOData[0].schacpersonaluniquecode = Utils.getAM(this.studentsSSOData[0].schacpersonaluniquecode);
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
                  // console.log(files);
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
