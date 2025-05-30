import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import * as XLSX from 'xlsx';
import { StudentAppsPreviewDialogComponent } from '../student-apps-preview-dialog/student-apps-preview-dialog.component';
import { DepManagerService } from '../dep-manager.service';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from '../period.model';
import { DepManager } from '../dep-manager.model';
import { BankUtils } from 'src/app/BankUtils';
import { StudentFilesViewDialogComponent } from '../student-files-view-dialog/student-files-view-dialog.component';
import {map, switchMap} from 'rxjs';
import {Phase} from '../phase.model';
import * as moment from 'moment';

@Component({
  selector: 'app-student-apps-results-old-periods',
  templateUrl: './student-apps-results-old-periods.component.html',
  styleUrls: ['./student-apps-results-old-periods.component.css']
})
export class StudentAppsResultsOldPeriodsComponent implements OnInit {
  @ViewChild('oldAppsTable') table: ElementRef | undefined;
  @ViewChild('photo') image!: ElementRef;
  @ViewChild('inputSearch') public inputElement!: ElementRef<HTMLInputElement>;
  periodLabel: string|null = null; // Default label text
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  selected = '';
  ngSelect = "";
  @Input()
  period!: Period;
  depManagerDataDepartment!: number;
  isLoading = true;
  depts5yearsStudyPrograms = [1511, 1512, 1522, 1523, 1524];
  yearsOfStudy!: number;
  periods: Period[] | undefined;
  isActive = true;
  public resignAppFiles: boolean[] = [];
  public idFiles: boolean[] = [];
  public amaFiles: boolean[] = [];

  public filteredData: any = [];
  public isSortDirectionUp: boolean = true;
  public activeBtns: boolean[] = [false, false];

  constructor(
    public depManagerService: DepManagerService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef,
    private translate: TranslateService,
    public dialog: MatDialog
  ) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerDataDepartment = depManager.department_id;
        this.depManagerService.getAllPeriodsByDepartmentId(this.depManagerDataDepartment)
          .subscribe((periods: any[]) => {
            this.periods = periods = periods.filter((period: Period) => !period.is_active);
            this.period = periods[0];
            if (this.periods?.length == 0) {
              this.isLoading = false;
              return;
            }
            this.depManagerService.getStudentsRankingListFromAPI(this.depManagerDataDepartment, this.period.id)
              .subscribe((students: Student[]) => {
                this.studentsData = students;
                for (let i = 0; i < students.length; i++) {
                  this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
                  this.studentsData[i].user_ssn = students[i].user_ssn;
                  this.checkIfFileExistsFor(i, this.studentsData[i].sso_uid, 'RESIGN');
                  this.checkIfFileExistsFor(i, this.studentsData[i].sso_uid, 'IDENTITY');
                  this.checkIfFileExistsFor(i, this.studentsData[i].sso_uid, 'AMA');
                }

              });
              this.isLoading = false;
            },
            (error) => {
              console.log('get Old Periods error:', error);
              this.isLoading = false;
              return false;
            }
          );
      });
  }

  toggleSortDirection(sortIconIndex: number): void {
    this.isSortDirectionUp = !this.isSortDirectionUp;

    // Set the clicked button to active
    this.activeBtns[sortIconIndex] = true;

    // Deactivate all other buttons
    for (let i = 0; i < this.activeBtns.length; i++) {
      if (i !== sortIconIndex) {
        this.activeBtns[i] = false;
      }
    }
  }

  sortData(): void {
    const studentFinalData = this.filteredData.length ? this.filteredData : this.studentsData;
    this.filteredData = Utils.sortStudentsData(studentFinalData, this.isSortDirectionUp);
  }

  searchStudents() {
    const inputText = this.inputElement.nativeElement.value;
    this.filteredData = this.studentsData.filter(
      student => student.givenname.includes(inputText.toUpperCase())
      || student.schacpersonaluniquecode.includes(inputText)
      || student.sn.includes(inputText.toUpperCase())
    );
  }

  checkIfFileExistsFor(i: number, studentId: number, docType: string): any {
    if (docType == 'RESIGN') {
      this.depManagerService.receiveFile(studentId, docType).subscribe(res => {
        this.resignAppFiles[i] = (res.type != 'application/json');
      });
    } else if (docType == 'IDENTITY') {
      this.depManagerService.receiveFile(studentId, docType).subscribe(res => {
        this.idFiles[i] = (res.type != 'application/json');
      });
    } else if (docType == 'AMA') {
      this.depManagerService.receiveFile(studentId, docType).subscribe(res => {
        this.amaFiles[i] = (res.type != 'application/json');
      });
    }
  }

  onPeriodChange(valuePeriodId: any) {
    this.period.id = valuePeriodId;
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerDataDepartment = depManager.department_id;
          this.depManagerService.getStudentsRankingListFromAPI(this.depManagerDataDepartment, valuePeriodId)
            .subscribe((students: Student[]) => {
              this.studentsData = students;
              for (let i = 0; i < students.length; i++) {
                this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
                this.studentsData[i].user_ssn = students[i].user_ssn;
              }
            });
            this.isLoading = false;
          },
          (error) => {
            console.log('get Old Periods error:', error);
            this.isLoading = false;
            return false;
          });
  }

  // This function is used to get the AM of the student
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  receiveFile(studentId: number, docType: string) {
    this.depManagerService.receiveFile(studentId, docType).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

// this.depManagerService.getPhasesByPeriodId(this.data.periodId).subscribe((phases: Phase[]) => {
//       this.phases = phases;
//       for (let phase of this.phases) {
//         phase.date_from = moment(phase.date_from).format('DD/MM/YYYY');
//         phase.date_to = moment(phase.date_to).format('DD/MM/YYYY');
//       }
//     });
  /**
   * Fetches phases by period ID and formats the dates.
   */
  fetchAndFormatPhases(periodId: number) {
    return this.depManagerService.getPhasesByPeriodId(periodId).pipe(
      map((phases: Phase[]) => {
        if (!phases || phases.length === 0) {
          throw new Error("No phases found"); // Handle empty response
        }
        
        // Extract and format dates from the first phase
        const date_from = moment(phases[0].date_from).format('DD/MM/YYYY');
        const date_to = moment(phases[0].date_to).format('DD/MM/YYYY');

        return { date_from, date_to }; // Return as an object
      })
    );
  }

  /**
   * Exports student data to an Excel file after fetching phases.
   */
  exportToExcel(): void {
    let periodId = this.period.id;
    this.fetchAndFormatPhases(periodId).subscribe(({ date_from, date_to }) => {
      let studentsDataJson: any = [];
      for (const item of this.studentsData) {
        let criteriaGrades = this.getCriteriaGrades(item.Semester, item.Ects, item.Grade);
        // let gradeFromSemesterΙn100 = this.getSemesterPercent(item.Semester);
        studentsDataJson.push({
          "Κατάταξη": item.ranking,
          "Αποτελέσματα": (item.phase == 2 ? item.is_approved ? 'Έγκριση - Επιτυχών' : 'Έγκριση - Επιλαχών' : 'Απόρριψη'),
          "Βαθμολογία (στα 100)": item.score,
          "Σταθμισμένος Μ.Ο.": item.Grade,
          "Σταθμισμένος Μ.Ο. (στα 100)": criteriaGrades[0],
          "Σύνολο ECTS": item.Ects,
          "Βαθμός από ECTS (στα 100)": criteriaGrades[1].toFixed(2),
          "Εξάμηνο Φοίτησης": item.Semester,
          "Βαθμός από Εξάμηνο Φοίτησης (στα 100)": criteriaGrades[2],
          "Έναρξη Αιτήσεων": date_from,
          "Λήξη Αιτήσεων": date_to,
          "Α.Π.": item.latest_app_protocol_number,
          "ΑΜ": item.schacpersonaluniquecode,
          "Επώνυμο": item.sn,
          "Όνομα": item.givenname,
          "Πατρώνυμο": item.father_name,
          "Μητρώνυμο": item.mother_name,
          "Επώνυμο πατέρα": item.father_last_name,
          "Επώνυμο μητέρας": item.mother_last_name,
          "email": item.mail,
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
          "Τράπεζα": BankUtils.getBankNameByIBAN(item.iban),
          "IBAN": item.iban,
          "AMA": item.ama_number,
          "ΑΔΤ": item.id_card
        });
      }

      const excelFileName: string = "StudentsPhase1.xlsx";
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson) //table_to_sheet((document.getElementById("oldAppsTable") as HTMLElement));
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* Save to file */
      XLSX.writeFile(wb, excelFileName);
    });
  }

  ngAfterViewInit(): void {
    // $('#oldAppsTable').DataTable();
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

  openDialog(idx: any) {
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const dialogRef = this.dialog.open(StudentAppsPreviewDialogComponent, {
      // width: '350px',
      data: { studentsData: studentFinalData, index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCommentsDialog(idx: any) {
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      data: { studentsData: studentFinalData, index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /**
   * get the grade for each criterion of the algorithm
   * @param semester the semester of the student
   * @param ects ects the student has so far
   * @param grade weighted average based on ects
   * @returns an array with a grade for each criterion
   */
  getCriteriaGrades(semester: number | undefined, ects: number | undefined, grade: number | undefined) {
    const ECTS_PER_SEMESTER = 30;

    // checks for undefined values
    ects = (ects ?? 0);
    grade = (grade ?? 0);

    // max years of study: 4 or 5 years depending on the school
    this.yearsOfStudy = this.depts5yearsStudyPrograms.includes(this.depManagerDataDepartment) ? 5 : 4;

    // all weights sum must be equal to 1
    // const weightGrade = 0.5;
    // const weightSemester = 0.4;
    // const weightYearOfStudy = 0.1;

    let academicYear = Math.round((semester ?? 0) / 2);
    let yearTotal = (academicYear <= this.yearsOfStudy) ? 100 : 100 - 10 * (academicYear - this.yearsOfStudy);
    if (yearTotal < 0) yearTotal = 0;

    const capped = 2 * (this.yearsOfStudy - 1);
    const maxECTS = capped * ECTS_PER_SEMESTER;
    const studentsECTS = (ects > maxECTS) ? maxECTS : ects;

    // return the actual calculation
    return [grade * 10,
      (studentsECTS / maxECTS) * 100,
      yearTotal];
  }

  openStudentFilesViewDialog(idx: any) {
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const dialogRef = this.dialog.open(StudentFilesViewDialogComponent, {
      data: {
        student: studentFinalData[idx],
        resignAppFiles: this.resignAppFiles,
        index: idx,
        idFiles: this.idFiles,
        amaFiles: this.amaFiles
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
