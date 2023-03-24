import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { DepManagerService } from 'src/app/department-managers/dep-manager.service';
import { DepManager } from 'src/app/department-managers/dep-manager.model';
import { Period } from 'src/app/department-managers/period.model';
import { EditContractDialogComponent } from 'src/app/department-managers/edit-contract-dialog/edit-contract-dialog.component';
import { StudentsMatchedInfoDialogComponent } from 'src/app/department-managers/students-matched-info-dialog/students-matched-info-dialog.component';
import { OfficeUser } from '../office-user.model';
import { OfficeService } from '../office.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-contracts-office',
  templateUrl: './student-contracts-office.component.html',
  styleUrls: ['./student-contracts-office.component.css']
})
export class StudentContractsOfficeComponent implements OnInit {
  @ViewChild('contractsTable') contractsTable: ElementRef | undefined;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: any[] = [];
  selected = '';
  ngSelect = '';
  depManagerData: DepManager | undefined;
  studentName!: string;
  periods: Period[] | undefined;
  isLoading: boolean = false;
  studentContract: any;
  public periodData!: Period;
  fontSize: number = 100;
  private language!: string;
  dateFrom: string = "";
  dateTo: string = "";
  officeUserData!: OfficeUser;
  officeUserAcademics!: any[];
  @ViewChild('periodFormSelect') periodFormSelect!: ElementRef;
  @ViewChild('departmentSelect') departmentSelect!: ElementRef;

  phaseArray = ["no-state",
    "1. Αιτήσεις ενδιαφέροντος φοιτητών",
    "2. Επιλογή θέσεων από φοιτητές",
    "3. Ολοκλήρωση - Συμβάσεις"];

  selectedDepartment: any = {
    academic_id: 0,
    department: ''
  };

  constructor(public depManagerService: DepManagerService, public studentsService: StudentsService, public authService: AuthService,
    private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog, private officeService: OfficeService) { }

  dtOptions: any = {};

  ngOnInit() {
    this.officeService.getOfficeUser()
      .subscribe((officeUser: OfficeUser) => {
        this.officeUserData = officeUser;
        this.selectedDepartment.department = this.selectedDepartment.department == null ? this.officeUserData.department : this.selectedDepartment.department;
        this.selectedDepartment.academic_id = this.selectedDepartment.department == null ? this.officeUserData.department_id : this.selectedDepartment.academic_id;

        this.isLoading = false;

        this.officeService.getAcademicsByOfficeUserId()
          .subscribe((academics: any) => {
            this.officeUserAcademics = academics;
        });
        //  this.initDataTable(); // Call it here
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

  openEditContractDialog(idx: any) {
    console.log(idx);
    console.log(this.studentsData[idx])
    const dialogRef = this.dialog.open(EditContractDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onPeriodChange(value: any) {
    this.isLoading = true;
    this.selected = value;
    this.studentsData = [];

    let periodId = value? value: this?.periods ? this.periods[0].id : 0;
    this.officeService.getStudentListForPeriodAndAcademic(this.selectedDepartment.academic_id, periodId)
      .subscribe({
        next: (students: any) => {
          this.studentsData.splice(0,this.studentsData.length);
          this.studentsData = students;
          for (let i = 0; i < students.length; i++) {
            this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
            this.studentsData[i].user_ssn = students[i].user_ssn;
          }

          this.initDataTable();
          this.isLoading = false;
      }, error: (error: any) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  private initDataTable(): void {
  // if (this.contractsTable) {
  //   (this.contractsTable as any).destroy();
  // }
  this.chRef.detectChanges();
  // Use of jQuery DataTables
  const table: any = $('#contractsTable');
  this.contractsTable = table.DataTable({
    destroy: true,
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
    columnDefs: [{ orderable: false, targets: [3] }]
  });
}


  onDepartmentChange(value: any) {
    this.isLoading = true;
    this.periods = [];
    let previous = this.selectedDepartment;
    this.selectedDepartment = value;

    this.depManagerService.getAllPeriodsByDepartmentId(Number(this.selectedDepartment.academic_id))
      .subscribe((periods: any[]) => {
        this.periods = periods;
        let periodId: any = this.selected ? this.selected : this?.periods ? this.periods[0].id : 0;
        if (!this.selected || previous == value) {
          this.studentsData = [];
          return;
        }
        this.officeService.getStudentListForPeriodAndAcademic(Number(this.selectedDepartment.academic_id), periodId)
        .subscribe({
          next: (students: any) => {
            if (!this.selected) return;
            if (students.length == 0) {
              this.selected = "";
              this.periods = [];
            }

            this.studentsData = students;
            for (let i = 0; i < students.length; i++) {
              this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
              this.studentsData[i].user_ssn = students[i].user_ssn;
            }

            this.isLoading = false;
          }, error: (error: any) => {
            console.log(error);
            this.isLoading = false;
          }
        });
    });
  }

  downloadContractFileForStudent(studentId: number) {
    let initialPeriod: any = !this.periods || !this.periods[0] ? 0 : this.periods[0].id;

    this.depManagerService.receiveContractFile(studentId, this.selected ? this.selected: initialPeriod , this.selectedDepartment?.academic_id, "docx")
    .subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
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

  exportToExcel() {
    let studentsDataJson: any = [];
    this.depManagerService.getContractDetailsByStudentIdAndPeriodId(this.studentsData[0].student_id, Number(this.selected ? this.selected: this.periods? this.periods[0].id : 0))
    .subscribe((contract: any) => {
      this.studentContract = contract;
      this.studentContract.contract_date = moment(this.studentContract.contract_date).format('YYYY-MM-DD');
      this.studentContract.pa_start_date = moment(this.studentContract.pa_start_date).format('YYYY-MM-DD');
      this.studentContract.pa_end_date = moment(this.studentContract.pa_end_date).format('YYYY-MM-DD');

      for (const item of this.studentsData) {
        studentsDataJson.push({
          "A/A": this.studentsData.indexOf(item) + 1,
          "ΑΜ": item.schacpersonaluniquecode,
          "Ημερομηνία Υπογραφής": this.studentContract.contract_date,
          "Επωνυμία Εταιρείας": this.studentContract.company_name,
          "ΑΦΜ Εταιρείας": this.studentContract.company_afm,
          "Διεύθυνση Εταιρείας": this.studentContract.company_address,
          "Εκπρόσωπος Εταιρείας": this.studentContract.company_liaison,
          "Θέση Εκπροσώπου Εταιρείας": item.company_liaison_position,
          "Ονοματεπώνυμο": this.studentContract.displayname,
          "Πατρώνυμο": this.studentContract.father_name,
          "Τμήμα": this.studentContract.dept_name,
          "Αριθμός Ταυτότητας": this.studentContract.id_number,
          "ΑΜΑ-ΙΚΑ": this.studentContract.amika,
          "ΑΜΚΑ": this.studentContract.amka,
          "ΑΦΜ": this.studentContract.afm,
          "ΔΟΥ": this.studentContract.doy_name,
          "Αντικείμενο Πρακτικής Άσκησης": this.studentContract.pa_subject,
          "Από ΑΤΛΑ - Αντικείμενο ΠΑ": this.studentContract.pa_subject_atlas,
          "Ημερομηνία Έναρξης ΠΑ": this.studentContract.pa_start_date,
          "Ημερομηνία Λήξης ΠΑ": this.studentContract.pa_end_date,
          "Όνομα ΤΥ": this.studentContract.department_manager_name,
          "email": item.mail,
        });
      }
      const excelFileName: string = "StudentsContracts.xlsx";
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* Save to file */
      XLSX.writeFile(wb, excelFileName);
    });
  }
}
