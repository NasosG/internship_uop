import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import * as XLSX from 'xlsx';
import { StudentAppsPreviewDialogComponent } from '../student-apps-preview-dialog/student-apps-preview-dialog.component';
import { DepManagerService } from '../dep-manager.service';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import {AuthService} from 'src/app/auth/auth.service';
import { Period } from '../period.model';
import {DepManager} from '../dep-manager.model';
import {catchError, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-student-applications-results',
  templateUrl: './student-applications-results.component.html',
  styleUrls: ['./student-applications-results.component.css']
})
export class StudentApplicationsResultsComponent implements OnInit {

  @ViewChild('example2') table: ElementRef | undefined;
  @ViewChild('photo') image!: ElementRef;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  selected = '';
  ngSelect = "";
  @Input()
  period!: Period;
  depManagerDataDepartment!: number;
  //depts5yearsStudyPrograms = [1511, 1512, 1522, 1523, 1524];
  //yearsOfStudy: number | undefined;

  constructor(public depManagerService: DepManagerService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerDataDepartment = depManager.department_id;

        //this.yearsOfStudy = this.depts5yearsStudyPrograms.includes(this.depManagerDataDepartment) ? 5 : 4;

        this.depManagerService.getPeriodByDepartmentId(this.depManagerDataDepartment)
            // .pipe(
            //   catchError((error: HttpErrorResponse) => {
            //     console.error(error);
            //     return throwError(error);
            //   })
            // )
            .subscribe((periodData: Period) => {
              this.period = periodData;
              this.depManagerService.insertApprovedStudentsRank(this.depManagerDataDepartment, this.period.phase_state, this.period.id)
                    .subscribe((response: any) => {
                        console.log('insertApprovedStudentsRank success:', response);
                        this.depManagerService.getStudentsRankingListFromAPI( this.depManagerDataDepartment, periodData.id)
                              .subscribe((students: Student[]) => {
                                this.studentsData = students;

                                for (let i = 0; i < students.length; i++) {
                                  this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
                                  this.studentsData[i].user_ssn = students[i].user_ssn;
                                }
                                // Have to wait till the changeDetection occurs. Then, project data into the HTML template
                                this.chRef.detectChanges();

                                // Use of jQuery DataTables
                                const table: any = $('#example2');
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
                                  columnDefs: [{ orderable: false, targets: [0, 6, 8] }],
                                  language: {
                                  },
                                });
                              });
                      },
                      (error) => {
                        console.log('insertApprovedStudentsRank error:', error);
                        return false;
                      }
                    );
            });
      });
  }

  // This function is used to get the AM of the student
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  receiveFile(studentId: number, docType: string) {
    // this.depManagerService.receiveFile();
    this.depManagerService.receiveFile(studentId, docType).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }
  // downloadFile(data: any) {
  //   let blob = new Blob([data]);
  //   let url = window.URL.createObjectURL(blob);
  //   let pwa = window.open(url);
  //   if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
  //       alert('Please disable your Pop-up blocker and try again.');
  //   }
  // }

  exportToExcel() {
    let studentsDataJson: any = [];
    for (const item of this.studentsData) {
      studentsDataJson.push({
        "Κατάταξη": item.ranking,
        "Αποτελέσματα": (item.phase == 2 ? item.is_approved ? 'Έγκριση - Επιτυχών' : 'Έγκριση - Επιλαχών' : 'Απόρριψη'),
        "Βαθμολογία": item.score,
        // "Κριτήριο ΜΟ": (item.score ?? 0) * 0.5,
        // "Κριτήριο ects": (item.Ects ?? 0) * 0.4,
        // "Κριτήριο εξάμηνο": (item.score ?? 0) * 0.1,
        "Α.Π.": item.latest_app_protocol_number,
        "ΑΜ": item.schacpersonaluniquecode,
        "Επώνυμο": item.sn,
        "Όνομα": item.givenname,
        "Πατρώνυμο": item.father_name,
        "Μητρώνυμο": item.mother_name,
        "Επώνυμο πατέρα": item.father_last_name,
        "Επώνυμο μητέρας": item.mother_last_name,
        "Υπηρετώ στο στρατό ": item.military_training == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "AMEA κατηγορίας 5 ": item.amea_cat == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "Σύμβαση εργασίας ": item.working_state == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.schacdateofbirth),
        "Φύλο": item.schacgender == 1 ? 'Άνδρας' : 'Γυναίκα',
        "Τηλέφωνο": item.phone,
        "Πόλη": item.city,
        "ΤΚ": item.post_address,
        "Διεύθυνση": item.address,
        "Τοποθεσία": item.location,
        "Χώρα": item.country == "gr" ? 'Ελλάδα' : item.country,
        "ΑΦΜ": item.ssn,
        "AMKA": item.user_ssn,
        "ΔΟΥ": item.doy,
        "IBAN": item.iban
      });
    }

    const excelFileName: string = "StudentsPhase1.xlsx";
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson) //table_to_sheet((document.getElementById("example2") as HTMLElement));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Save to file */
    XLSX.writeFile(wb, excelFileName);
  }

  ngAfterViewInit(): void {
    // $('#example2').DataTable();
  }

  printDataTable() {
    let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write("<h5 style='text-align: right;'>" + currentDate + "</h5><br>");
    windowPrint?.document.write("<table style=\"width: 100%;\"> \
        <thead style=\"color:white; background-color:#2d4154;\"> \
          <tr> \
            <th>Α.Π.</th> \
            <th>Όνοματεπώνυμο</th> \
            <th>ΑΜ</th> \
            <th>Υπηρετώ στρατό</th> \
            <th>ΑΜΕΑ κατ. 5</th> \
            <th>Σύμβαση εργασίας</th> \
            <th>Κατάσταση</th> \
          </tr> \
        </thead>");

    let i = 0;
    for (let student of this.studentsData) {
      windowPrint?.document.write(
        // print the rows - another color for the odd lines - could be done with i % 2 != 0
        // but with bitwise operator it was a bit faster
        "<tr " + ((i & 1) ? "style=\"background-color: #f3f3f3;\">" : ">") +
        "<td>" + student.latest_app_protocol_number + "</td>" +
        "<td>" + student.sn + " " + student.givenname + "</td>" +
        "<td>" + student.schacpersonaluniquecode + "</td>" +
        "<td>" + (student.military_training == true ? 'ΝΑΙ' : 'ΟΧΙ') + "</td>" +
        "<td>" + (student.amea_cat == true ? 'ΝΑΙ' : 'ΟΧΙ') + "</td>" +
        "<td>" + (student.working_state == true ? 'ΝΑΙ' : 'ΟΧΙ') + "</td>" +
        "<td>" + (student.phase == 2 ? student.is_approved ? 'Έγκριση - Επιτυχών' : 'Έγκριση - Επιλαχών' : 'Απόρριψη') + "</td>" +
        "</tr>");
      i++;
    }
    windowPrint?.document.write("</table>")
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

  onSubmitSelect(option: string, studentId: number) {
    // this.validateFormData(formData);
    let phase;
    phase = (option == "option1") ? 2 : (option == "option2") ? -1: 1;
    console.log("phase: " + phase + " stId: " + (studentId));
    this.depManagerService.updatePhaseByStudentId(phase, studentId);
    // this.onSavePeriodAlert();
  }

  openDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(StudentAppsPreviewDialogComponent, {
      // width: '350px',
      data: { studentsData: this.studentsData, index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCommentsDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
