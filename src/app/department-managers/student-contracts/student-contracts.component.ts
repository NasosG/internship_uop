import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentsService } from 'src/app/students/student.service';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { EditContractDialogComponent } from '../edit-contract-dialog/edit-contract-dialog.component';
import { Period } from '../period.model';
import { StudentsMatchedInfoDialogComponent } from '../students-matched-info-dialog/students-matched-info-dialog.component';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Contract } from 'src/app/students/contract.model';
import { CompanyAndPositionInfoDialogComponent } from '../company-and-position-info-dialog/company-and-position-info-dialog.component';
import { ImplementationDatesChangeDialogComponent } from '../implementation-dates-change-dialog/implementation-dates-change-dialog.component';
import { InternshipCompletionDialogComponent } from '../internship-completion-dialog/internship-completion-dialog.component';
import { Utils } from 'src/app/MiscUtils';
import { BankUtils } from 'src/app/BankUtils';

@Component({
  selector: 'app-student-contracts',
  templateUrl: './student-contracts.component.html',
  styleUrls: ['./student-contracts.component.css']
})
export class StudentContractsComponent implements OnInit {
  @ViewChild('contractsTable') public contractsTable?: ElementRef;
  @ViewChild('inputSearch') public inputElement!: ElementRef<HTMLInputElement>;
  public filteredData: any = [];
  public studentsData: any[] = [];
  private studentContracts!: Contract[];
  public selected = '';
  public depManagerData: DepManager | undefined;
  public studentName!: string;
  public periods: Period[] | undefined;
  public isLoading: boolean = false;
  public filteredStudentsCount: number = 0;
  private periodIdAfterChange: number | null = null;
  public isSortDirectionUp: boolean = true;
  public activeBtns: boolean[] = [false, false];

  constructor(
    public depManagerService: DepManagerService,
    public studentsService: StudentsService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef,
    private translate: TranslateService,
    public dialog: MatDialog
  ) { }

  updateFilteredStudentsCount() {
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    this.filteredStudentsCount = studentFinalData.filter((student: {status: number;}) => student.status != -1).length;
  }

  // Method to toggle the sort direction
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

  sortDataByField(fieldName: string): void {
    const studentFinalData = this.filteredData.length ? this.filteredData : this.studentsData;
    this.filteredData = Utils.sortStudentsDataGeneric(studentFinalData, this.isSortDirectionUp, fieldName);
  }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;

        this.depManagerService.getAllPeriodsByDepartmentId(this.depManagerData.department_id)
          .subscribe((periods: any[]) => {
            this.periods = periods;

            this.depManagerService.getStudentListForPeriod(periods[0].id)
              .subscribe((students: any[]) => {

                this.studentsData = students;
                for (let i = 0; i < students.length; i++) {
                  this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
                  this.studentsData[i].user_ssn = students[i].user_ssn;
                }

                // Have to wait till the changeDetection occurs. Then, project data into the HTML template
                this.chRef.detectChanges();

                // Use of jQuery DataTables
                // const table: any = $('#contractsTable');
                // this.contractsTable = table.DataTable({
                //   lengthMenu: [
                //     [10, 25, 50, -1],
                //     [10, 25, 50, 'All']
                //   ],
                //   pageLength: -1,  /* Set default to 'All' */
                //   lengthChange: false,
                //   paging: true,
                //   searching: false,
                //   ordering: false,
                //   info: true,
                //   autoWidth: false,
                //   responsive: true,
                //   select: true,
                //   pagingType: 'full_numbers',
                //   processing: true,
                //   columnDefs: [{ orderable: false, targets: [3] }]
                // });
              });
        });
    });
  }

  searchStudents() {
    const inputText = this.inputElement.nativeElement.value;
    this.filteredData = this.studentsData.filter(
      student => student.givenname.includes(inputText.toUpperCase())
      || student.schacpersonaluniquecode.includes(inputText)
      || student.sn.includes(inputText.toUpperCase())
    );
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
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const dialogRef = this.dialog.open(EditContractDialogComponent, {
      data: { studentsData: studentFinalData, index: idx }, width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onPeriodChange(value: any) {
    this.isLoading = true;
    this.selected = value;
    this.periodIdAfterChange = value;
    this.filteredData = [];

    this.depManagerService.getStudentListForPeriod(value)
    .subscribe({
      next: (students: any[]) => {
        this.studentsData = [];
        this.studentsData = students.map(student => ({
          ...student,
          schacpersonaluniquecode: this.getAM(student.schacpersonaluniquecode),
          user_ssn: student.user_ssn
        }));

        this.isLoading = false;
        this.updateFilteredStudentsCount();
      }, error: (error: any) => {
          console.log(error);
          this.isLoading = false;
      }
    });
  }

  downloadContractFileForStudent(studentId: number) {
    let initialPeriod: any = !this.periods || !this.periods[0] ? 0 : this.periods[0].id;

    this.depManagerService.receiveContractFile(studentId, this.selected ? this.selected: initialPeriod, this.depManagerData?.department_id, "docx")
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
    this.depManagerService.getContractDetailsByDepartmentAndPeriod(this.studentsData[0].department_id, this.studentsData[0].period_id)
    .subscribe((contracts: Contract[]) => {
      if (!contracts) {
        console.error('No contracts found for the given student and period.');
        return;
      }

      this.studentContracts = contracts;
      for (let i = 0, j = 0; i < this.studentContracts.length; i++) {
        this.studentContracts[i].contract_date = moment(this.studentContracts[i].contract_date).format('YYYY-MM-DD');
        this.studentContracts[i].pa_start_date = moment(this.studentContracts[i].pa_start_date).format('YYYY-MM-DD');
        this.studentContracts[i].pa_end_date = moment(this.studentContracts[i].pa_end_date).format('YYYY-MM-DD');

        let studentIndex = this.studentsData.findIndex(student => student.uuid == this.studentContracts[i].student_id);

        if (this.studentsData[studentIndex]?.status == -1) {
          continue;
        }

        studentsDataJson.push({
          "A/A": ++j,
          "ΑΜ": studentIndex !== -1 ? this.studentsData[studentIndex].schacpersonaluniquecode : null,
          "Ημερομηνία Υπογραφής": this.studentContracts[i].contract_date,
          "Επωνυμία Εταιρείας": this.studentContracts[i].company_name,
          "ΑΦΜ Εταιρείας": this.studentContracts[i].company_afm,
          "Διεύθυνση Εταιρείας": this.studentContracts[i].company_address,
          "Εκπρόσωπος Εταιρείας": this.studentContracts[i].company_liaison,
          "Θέση Εκπροσώπου Εταιρείας": this.studentContracts[i].company_liaison_position,
          "Email Φορέα": this.studentContracts[i].contact_email,
          "Ονοματεπώνυμο": this.studentContracts[i].displayname,
          "Πατρώνυμο": this.studentContracts[i].father_name,
          "Επώνυμο πατέρα": studentIndex !== -1 ? this.studentsData[studentIndex].father_last_name: null,
          "Μητρώνυμο": studentIndex !== -1 ? this.studentsData[studentIndex].mother_name: null,
          "Επώνυμο μητέρας": studentIndex !== -1 ? this.studentsData[studentIndex].mother_last_name: null,
          "Τμήμα": this.studentContracts[i].dept_name,
          "Αριθμός Ταυτότητας": this.studentContracts[i].id_number,
          "ΑΜΑ-ΙΚΑ": this.studentContracts[i].amika,
          "ΑΜΚΑ": this.studentContracts[i].amka,
          "ΑΦΜ": this.studentContracts[i].afm,
          "ΔΟΥ": this.studentContracts[i].doy_name,
          "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(studentIndex !== -1 ? this.studentsData[studentIndex].schacdateofbirth : null),
          "Αντικείμενο Πρακτικής Άσκησης": this.studentContracts[i].pa_subject,
          "Από ΑΤΛΑ - Αντικείμενο ΠΑ": this.studentContracts[i].pa_subject_atlas,
          "Ημερομηνία Έναρξης ΠΑ": this.studentContracts[i].pa_start_date,
          "Ημερομηνία Λήξης ΠΑ": this.studentContracts[i].pa_end_date,
          "Όνομα ΤΥ": this.studentContracts[i].department_manager_name,
          "email": studentIndex !== -1 ? this.studentsData[studentIndex].mail : null,
          "Φύλο": studentIndex !== -1 ? this.studentsData[studentIndex].schacgender == 1 ? 'Άνδρας' : 'Γυναίκα' : null,
          "Τηλέφωνο": studentIndex !== -1 ? this.studentsData[studentIndex].phone : null,
          "Διεύθυνση": studentIndex !== -1 ? this.studentsData[studentIndex].address : null,
          "Πόλη": studentIndex !== -1 ? this.studentsData[studentIndex].city : null,
          "ΤΚ": studentIndex !== -1 ? this.studentsData[studentIndex].post_address : null,
          "Τοποθεσία": studentIndex !== -1 ? this.studentsData[studentIndex].location : null,
          "Τράπεζα": studentIndex !== -1 ? BankUtils.getBankNameByIBAN(this.studentsData[studentIndex].iban) : null,
          "IBAN": studentIndex !== -1 ? this.studentsData[studentIndex].iban : null
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

  openCompanyInfoDialog(positionId: any) {
    console.log(positionId);

    const dialogRef = this.dialog.open(CompanyAndPositionInfoDialogComponent, {
      data: { positionId: positionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openImplementationDatesChangeDialog(idx: number, assigned_position_id: number) {
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const implementationDatesArr = {
      implementation_start_date: studentFinalData[idx].pa_start_date,
      implementation_end_date: studentFinalData[idx].pa_end_date
    };

    console.log(implementationDatesArr.implementation_start_date);

    const dialogRef = this.dialog.open(ImplementationDatesChangeDialogComponent, {
      width: '600px',
      data: { assigned_position_id: assigned_position_id, implementationDates: implementationDatesArr }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openInternshipCompletionDialog(idx: number, assigned_position_id: number) {
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const implementationDatesArr = {
      implementation_start_date: studentFinalData[idx].pa_start_date,
      implementation_end_date: studentFinalData[idx].pa_end_date
    };

    console.log(implementationDatesArr.implementation_start_date);
    const dialogRef = this.dialog.open(InternshipCompletionDialogComponent, {
      width: '600px',
      data: {
        assigned_position_id: assigned_position_id,
        studentId: studentFinalData[idx].student_id,
        periodId: studentFinalData[idx].period_id,
        implementationDates: implementationDatesArr
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === Utils.CustomDialogAction.OK) {
        studentFinalData[idx].status = 1;
      }
    });
  }

  private turnTimestampToDatePrint(timestamp: any) {
    return moment(timestamp).format('DD/MM/YYYY');
  }

  printCompletionCertificate(idx: number, student: any) {
    if (!student) return;
    let studentName = student.givenname + " " + student.sn;

    const pdfData = {
      student_name: studentName,
      department: student.dept_name,
      father_name: student.father_name,
      university: "ΠΑΝΕΠΙΣΤΗΜΙΟ ΠΕΛΟΠΟΝΝΗΣΟΥ",
      AM: student.schacpersonaluniquecode,
      position_id: student.assigned_position_id,
      internshipSubject: student.pa_subject,
      start_date: this.turnTimestampToDatePrint(student.pa_start_date),
      end_date: this.turnTimestampToDatePrint(student.pa_end_date),
      company: student.asgmt_company_name,
      department_manager: student.department_manager_name,
      date_now: new Date().toLocaleDateString('el-GR')
    };

    this.depManagerService.receiveCompletionCertificateFile(pdfData , "doc")
    .subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

}
