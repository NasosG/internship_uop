import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap } from 'rxjs';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import Swal from 'sweetalert2';
import { ActiveApplication } from '../active-application.model';
import { DepManagerService } from '../dep-manager.service';
import * as XLSX from 'xlsx';
import { Period } from '../period.model';
import { StudentsMatchedInfoDialogComponent } from '../students-matched-info-dialog/students-matched-info-dialog.component';
import { StudentsPositionAssignmentDialogComponent } from '../students-position-assignment-dialog/students-position-assignment-dialog.component';
import { CompanyInfoDialogComponent } from '../company-info-dialog/company-info-dialog.component';
import { AcceptedAssignmentsByCompany } from 'src/app/students/accepted-assignments-by-company';
import { StudentsPositionSelectDialogComponent } from '../students-position-select-dialog/students-position-select-dialog.component';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[2], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[0], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
	}
}

@Component({
  selector: 'app-student-match',
  templateUrl: './student-match.component.html',
  styleUrls: ['./student-match.component.css'],
  providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	]
})
export class StudentMatchComponent implements OnInit {
  @ViewChild('studentsTable') table: ElementRef | undefined;
  studentsData: Student[] = [];
  activeApplications!: ActiveApplication[];
  applicationDateStr!: string[];
  selected = '';
  ngSelect = "";
  @Input() period: Period | undefined;
  assignments!: AcceptedAssignmentsByCompany[];
  positionAssigned!: boolean;
  state: Array<Map<number, number>> = [];
  assignedPos: Array<Map<number, string>> = [];
  positionIds: Array<Map<number, any>> = [];
  modelImplementationDateFrom!: string;
  modelImplementationDateTo!: string;
  department_id!: number;
  period_id!: number;

  constructor(public depManagerService: DepManagerService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .pipe(
        mergeMap((result: { department_id: number; }) =>
          this.depManagerService.getStudentActiveApplications(result?.department_id))
      )
      .subscribe((application: ActiveApplication[]) => {
        this.activeApplications = application;

        for (let application of this.activeApplications) {
          application.reg_code = this.getAM(application.reg_code);
          application.applicationDateStr = Utils.reformatDateToEULocaleStr(application.application_date);

          this.depManagerService.getAssignmentsByStudentId(application.student_id)
          .subscribe((assignments: AcceptedAssignmentsByCompany[]) => {
            this.assignments = assignments;

            // set appAssigned to true there are any records of this.assignments
            for (let assignment of this.assignments) {
              if (assignment.approval_state == 1 || assignment.approval_state == 0 || assignment.approval_state == null) {
                this.positionAssigned = true;

                let positionIdsMap = new Map<number, any>([[application.student_id, (assignment as any).position_id]]);
                let assignedPosMap = new Map<number, string>([[application.student_id, assignment.title + ' - ' + assignment.name]]);
                let stateMap: Map<number, number> = new Map<number, number>([[application.student_id, assignment.approval_state == 1 ? 1 : 0]]);
                this.positionIds.push(positionIdsMap);
                this.assignedPos.push(assignedPosMap);
                this.state.push(stateMap);
              }
            }
          });

        }
        // TODO: When provider assigns students, need to fetch the provider name

        // Have to wait till the changeDetection occurs. Then, project data into the HTML template
        this.chRef.detectChanges();

        // Use of jQuery DataTables
        const table: any = $('#studentsTable');
        this.table = table.DataTable({
          lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, 'All']
          ],
          lengthChange: true,
          paging: true,
          searching: true,
          ordering: false,
          info: true,
          autoWidth: false,
          responsive: true,
          select: true,
          pagingType: 'full_numbers',
          processing: true,
          columnDefs: [{ orderable: false, targets: [3, 4, 5] }]
        });
      });

      this.depManagerService.getPeriodAndDepartmentIdByUserId()
        .subscribe((response: any) => {
          this.department_id = response?.department_id;
          this.period_id = response?.id;

          this.depManagerService.getAssignImplementationDates(this.department_id, this.period_id).subscribe((dates: any) => {
            this.modelImplementationDateFrom = moment(dates.implementation_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            this.modelImplementationDateTo = moment(dates.implementation_end_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          });
        });
  }

  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  isPositionAssigned(positionIds: Map<number, any>[], studentId: number, positionId: number): boolean {
    return positionIds.some(map => map.get(studentId) === positionId);
  }

  hasStateWithNumber(positionIds: Map<number, any>[], studentId: number, numberParam: number): boolean {
    return positionIds.some(map => map.get(studentId) === numberParam);
  }

  getApprovalState(state: Map<number, any>[], studentId: number, positionId: number) {
    // Find the position assigned to the student
    const assignedPosition = this.positionIds.find(map => map.has(studentId))?.get(studentId);
    // If the student is not assigned to a position, return null
    if (assignedPosition === undefined) {
      return null;
    }
    // If the assigned position does not match the specified position, return null
    if (assignedPosition !== positionId) {
      return null;
    }
    // Find the approval state for the specified position based on studentId
    const positionState = state.find(map => map.has(studentId))?.get(studentId);
    // If the approval state was found, return it (0 or 1)
    if (positionState !== undefined) {
      return positionState == 1 ? 1 : 0;
    }

    // If the position ID was not found, return null (or throw an error)
    return null;
  }


  exportToExcel() {
    let studentsDataJson: any = [];
    for (const item of this.activeApplications) {
      studentsDataJson.push({
        "Επώνυμο": item.lastname,
        "Όνομα": item.firstname,
        "Πατρώνυμο": item.father_name,
        "Μητρώνυμο": item.mother_name,
        "Επώνυμο πατέρα": item.father_last_name,
        "Επώνυμο μητέρας": item.mother_last_name,
        "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.date_of_birth),
        // "Έτος γέννησης": item.schacyearofbirth,
        "ΑΜ": item.reg_code,
        "Φύλο": item.gender == 1 ? 'Άνδρας' : 'Γυναίκα',
        // "Τηλέφωνο": item.phone,
        // "Πόλη": item.city,
        // "ΤΚ": item.post_address,
        // "Διεύθυνση": item.address,
        // "Τοποθεσία": item.location,
        // "Χώρα": item.country == "gr" ? 'Ελλάδα' : item.country,
        // "ΑΦΜ": item.ssn,
        // "AMKA": item.user_ssn,
        // "ΔΟΥ": item.doy,
        // "IBAN": item.iban,
        // "Εκπαίδευση": item.education,
        // "Άλλη εκπαίδευση": item.other_edu,
        // "Γνώσεις Η/Υ": item.computer_skills,
        // "skills": item.skills,
        // "honors": item.honors,
        // "Εμπειρία": item.experience,
        // "Γλώσσες": item.languages,
        // "Ενδιαφέροντα": item.interests,
        // "Υπηρετώ στο στρατό ": item.military_training == true ? 'ΝΑΙ' : 'ΟΧΙ',
        // "AMEA κατηγορίας 5 ": item.amea_cat == true ? 'ΝΑΙ' : 'ΟΧΙ',
        // "Σύμβαση εργασίας ": item.working_state == true ? 'ΝΑΙ' : 'ΟΧΙ',
        // "Αποτελέσματα": (item.phase == 2 ? 'Επιλέχτηκε' : item.phase == 1 ? 'Προς επιλογή' : 'Απορρίφτηκε')
        // "edupersonorgdn": item.edupersonorgdn,
      });
    }

    const excelFileName: string = "StudentsActiveApplications.xlsx";
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson) //table_to_sheet((document.getElementById("example") as HTMLElement));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Save to file */
    XLSX.writeFile(wb, excelFileName);
  }

  ngAfterViewInit(): void {
    // $('#example').DataTable();
  }

  printDataTable() {
    let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write("<h5 style='text-align: right;'>" + currentDate + "</h5><br>");
    windowPrint?.document.write("<table style=\"width: 100%;\"> \
        <thead style=\"color:white; background-color:#2d4154;\"> \
          <tr> \
            <th>Αριθμός Αίτησης</th> \
            <th>Ημερομηνία Αίτησης</th> \
            <th>Oναματεπώνυμο</th> \
            <th>ΑΜ</th> \
            <th>Επιλογές Φοιτητή</th> \
          </tr> \
        </thead>");

    let i = 0;
    for (let student of this.activeApplications) {
      let studentChoices = '';
      for (let j = 0; j < student.positions.length; j++) {
        studentChoices += (j + 1) + "." + student.positions[j].company + "<br>";
      }

      windowPrint?.document.write(
        // print the rows - another color for the odd lines - could be done with i % 2 != 0
        // but with bitwise operator it was a bit faster
        "<tr " + ((i & 1) ? "style=\"background-color: #f3f3f3;\">" : ">") +
        "<td>" + student.app_id + "</td>" +
        "<td>" + student.application_date + "</td>" +
        "<td>" + student.lastname + " " + student.firstname + "</td>" +
        "<td>" + student.reg_code + "</td>" +
        "<td>" + studentChoices + "</td>" +
        // "<td>" + "2.citrix" + "</td>" +
        "</tr>");
      i++;
    }
    windowPrint?.document.write("</table>")
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

  openDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(StudentsMatchedInfoDialogComponent, {
      data: { index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openPositionSelectionDialog(appId: any, assignMode: string) {
    console.log(appId);
    const dialogRef = this.dialog.open(StudentsPositionAssignmentDialogComponent, {
      data: { appId: appId, assignMode: assignMode }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openStudentsPositionSelectionDialog(appId: any, index: number, studentId:number, position_id: number) {
    // Users can't do any action if they do not fill implementation dates needed for the assignments
    if (!this.modelImplementationDateFrom || !this.modelImplementationDateTo) {
      Swal.fire({
        icon: 'error',
        title: 'Σφάλμα',
        text: 'Παρακαλούμε ορίστε τις ημερομηνίες διεξαγωγής ΠΑ για τους φοιτητές σας',
        confirmButtonText: 'Εντάξει'
      });
      return;
    }

    const implementationDatesArr = {
      implementation_start_date: moment(this.modelImplementationDateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      implementation_end_date: moment(this.modelImplementationDateTo, 'YYYY-MM-DD').format('DD/MM/YYYY')
    };

    let assignApprovalState = this.getApprovalState(this.state, studentId, position_id);
    const dialogRef = this.dialog.open(StudentsPositionSelectDialogComponent, {
      width: '400px',
      data: { appId: appId, index: index, approvalState: assignApprovalState, implementationDates: implementationDatesArr }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public add3Dots(inputText: string, limit: number): string {
    let dots = "...";
    if (inputText.length > limit) {
      inputText = inputText.substring(0, limit) + dots;
    }

    return inputText;
  }

  openCompanyInfoDialog(company: any, afm: string, positionGroupId: number) {
    const dialogRef = this.dialog.open(CompanyInfoDialogComponent, {
      data: { company: company, afm: afm, groupId: positionGroupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  calculateDates(value: any) {
    const depId = this.department_id ? this.department_id : this.activeApplications[0]?.department_id;
    const isTEIDepartment = (depId?.toString().length == 6);
    const depsWith2MonthsPractice = [190, 400, 104, 1518, 1513];
    const depsWith4MonthsPractice = [98, 1520];
    // console.log(value);

    let startDate = moment(value, 'YYYY-MM-DD');
    let endDate;

    if (isTEIDepartment) {
      endDate = startDate.clone().add(5, 'months').endOf('month');
    } else {
      if (depsWith4MonthsPractice.includes(depId)) {
        endDate = startDate.clone().add(3, 'months').endOf('month');
      } else if (depsWith2MonthsPractice.includes(depId)) {
        endDate = startDate.clone().add(1, 'months').endOf('month');
      } else {
        endDate = startDate.clone().add(2, 'months').endOf('month');
      }
    }

    return { startDate, endDate };
  }

  insertImplementationDates() {
    const implementationDates = {
      department_id: this.department_id ? this.department_id : this.activeApplications[0]?.department_id,
      period_id: this.period_id ? this.period_id : this.activeApplications[0].period_id,
      implementation_start_date: this.modelImplementationDateFrom,
      implementation_end_date: this.modelImplementationDateTo
    };

    console.log(implementationDates);

    if (implementationDates.implementation_start_date == null || implementationDates.implementation_end_date == null) {
      Swal.fire({
        icon: 'error',
        title: 'Σφάλμα',
        text: 'Παρακαλώ εισάγετε τις ημερομηνίες εφαρμογής',
        confirmButtonText: 'Εντάξει'
      });
      return;
    }

    if (implementationDates.implementation_start_date > implementationDates.implementation_end_date) {
      Swal.fire({
        icon: 'error',
        title: 'Σφάλμα',
        text: 'Η ημερομηνία έναρξης δεν μπορεί να είναι μεγαλύτερη από την ημερομηνία λήξης',
        confirmButtonText: 'Εντάξει'
      });
      return;
    }

    this.depManagerService.insertImplementationDates(implementationDates).subscribe(
      (response: any) => {
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Επιτυχία',
          text: 'Οι ημερομηνίες εφαρμογής εισήχθησαν με επιτυχία',
          confirmButtonText: 'Εντάξει'
        });
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Σφάλμα',
          text: 'Παρουσιάστηκε κάποιο σφάλμα κατά την εισαγωγή των ημερομηνιών εφαρμογής',
          confirmButtonText: 'Εντάξει'
        });
      }
    );
  }

}
