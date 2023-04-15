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

@Component({
  selector: 'app-payment-orders',
  templateUrl: './payment-orders.component.html',
  styleUrls: ['./payment-orders.component.css']
})
export class PaymentOrdersComponent implements OnInit {
  @ViewChild('contractsTable') contractsTable: ElementRef | undefined;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: any[] = [];
  private studentContracts!: Contract[];
  selected = '';
  ngSelect = '';
  depManagerData: DepManager | undefined;
  studentName!: string;
  periods: Period[] | undefined;
  isLoading: boolean = false;
  studentContract: any;

  constructor(public depManagerService: DepManagerService, public studentsService: StudentsService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }
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
          const table: any = $('#contractsTable');
          this.contractsTable = table.DataTable({
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
        });
      });
    });
  }

  formatDate = (date: any) => { return Utils.getAtlasPreferredTimestamp(date); }

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

  openEditPaymentOrderDialog(idx: any) {
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
    this.depManagerService.getStudentListForPeriod(value)
    .subscribe({
      next: (students: any[]) => {
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
  }

  downloadPaymentOrderFileForStudent(studentId: number) {
    let initialPeriod: any = !this.periods || !this.periods[0] ? 0 : this.periods[0].id;

    this.depManagerService.receiveContractFile(studentId, this.selected ? this.selected: initialPeriod , this.depManagerData?.department_id, "docx")
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
      for (let i = 0; i < this.studentContracts.length; i++) {
        this.studentContracts[i].contract_date = moment(this.studentContracts[i].contract_date).format('YYYY-MM-DD');
        this.studentContracts[i].pa_start_date = moment(this.studentContracts[i].pa_start_date).format('YYYY-MM-DD');
        this.studentContracts[i].pa_end_date = moment(this.studentContracts[i].pa_end_date).format('YYYY-MM-DD');

        let studentIndex = this.studentsData.findIndex(student => student.uuid == this.studentContracts[i].student_id);

        studentsDataJson.push({
          "A/A": i + 1,
          "ΑΜ": studentIndex !== -1 ? this.studentsData[studentIndex].schacpersonaluniquecode : null,
          "Ημερομηνία Υπογραφής": this.studentContracts[i].contract_date,
          "Επωνυμία Εταιρείας": this.studentContracts[i].company_name,
          "ΑΦΜ Εταιρείας": this.studentContracts[i].company_afm,
          "Διεύθυνση Εταιρείας": this.studentContracts[i].company_address,
          "Εκπρόσωπος Εταιρείας": this.studentContracts[i].company_liaison,
          "Θέση Εκπροσώπου Εταιρείας": this.studentContracts[i].company_liaison_position,
          "Ονοματεπώνυμο": this.studentContracts[i].displayname,
          "Πατρώνυμο": this.studentContracts[i].father_name,
          "Τμήμα": this.studentContracts[i].dept_name,
          "Αριθμός Ταυτότητας": this.studentContracts[i].id_number,
          "ΑΜΑ-ΙΚΑ": this.studentContracts[i].amika,
          "ΑΜΚΑ": this.studentContracts[i].amka,
          "ΑΦΜ": this.studentContracts[i].afm,
          "ΔΟΥ": this.studentContracts[i].doy_name,
          "Αντικείμενο Πρακτικής Άσκησης": this.studentContracts[i].pa_subject,
          "Από ΑΤΛΑ - Αντικείμενο ΠΑ": this.studentContracts[i].pa_subject_atlas,
          "Ημερομηνία Έναρξης ΠΑ": this.studentContracts[i].pa_start_date,
          "Ημερομηνία Λήξης ΠΑ": this.studentContracts[i].pa_end_date,
          "Όνομα ΤΥ": this.studentContracts[i].department_manager_name,
          "email": studentIndex !== -1 ? this.studentsData[studentIndex].mail : null
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
    const implementationDatesArr = {
      implementation_start_date: this.studentsData[idx].pa_start_date,
      implementation_end_date: this.studentsData[idx].pa_end_date
    };

    const dialogRef = this.dialog.open(ImplementationDatesChangeDialogComponent, {
      width: '600px',
      data: { assigned_position_id: assigned_position_id, implementationDates: implementationDatesArr }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openInternshipCompletionDialog(idx: number, assigned_position_id: number) {
    // const disabled = true;
    // Swal.fire({
    //   title: 'Αποτυχημένη ολοκλήρωση πρακτικής άσκησης',
    //   text: "Δεν μπορείτε να κάνετε ακόμη ολοκλήρωση πρακτικής άσκησης για τον συγκεκριμένο φοιτητή",
    //   icon: 'warning',
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Εντάξει'
    // });
    // if (disabled) return;
    const implementationDatesArr = {
      implementation_start_date: this.studentsData[idx].pa_start_date,
      implementation_end_date: this.studentsData[idx].pa_end_date
    };
    // console.log(assigned_position_id);
    console.log(implementationDatesArr.implementation_start_date);
    const dialogRef = this.dialog.open(InternshipCompletionDialogComponent, {
      width: '600px',
      data: {
        assigned_position_id: assigned_position_id,
        studentId: this.studentsData[idx].student_id,
        periodId: this.studentsData[idx].period_id,
        implementationDates: implementationDatesArr
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
