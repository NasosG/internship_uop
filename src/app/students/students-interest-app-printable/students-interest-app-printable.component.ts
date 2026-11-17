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
  // academic year of the application, e.g. "2026 - 2027" (from its period, sent by the backend)
  public academicYear: string | null = null;
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
            this.studentsService.getInterestAppDetailsIfExists(period.id)
              .subscribe((response: any) => {
                if (response.protocolNumber) {
                  this.studentsSSOData[0].latest_app_protocol_number = response.protocolNumber;
                }
                if (response.academicYear) {
                  this.academicYear = response.academicYear;
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
    if (this.academicYear) {
      return this.academicYear;
    }
    
    // Fallback: the academic year of today, which starts in September (as in the backend)
    const today = new Date();
    const startYear = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
    return `${startYear} - ${startYear + 1}`;
  }

}
