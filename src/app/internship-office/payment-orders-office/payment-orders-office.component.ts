import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentsService } from 'src/app/students/student.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Contract } from 'src/app/students/contract.model';
import { Utils } from 'src/app/MiscUtils';

import Swal from 'sweetalert2';
import { OfficeUser } from '../office-user.model';
import { OfficeService } from '../office.service';
import { DepManagerService } from 'src/app/department-managers/dep-manager.service';
import { Period } from 'src/app/department-managers/period.model';
import { EditPaymentOrderDialogComponent } from 'src/app/department-managers/edit-payment-order-dialog/edit-payment-order-dialog.component';
import { StudentsMatchedInfoDialogComponent } from 'src/app/department-managers/students-matched-info-dialog/students-matched-info-dialog.component';
import { CompanyAndPositionInfoDialogComponent } from 'src/app/department-managers/company-and-position-info-dialog/company-and-position-info-dialog.component';

@Component({
  selector: 'app-payment-orders-office',
  templateUrl: './payment-orders-office.component.html',
  styleUrls: ['./payment-orders-office.component.css']
})
export class PaymentOrdersOfficeComponent implements OnInit {
  @ViewChild('paymentsTable') public paymentsTable?: ElementRef;
  @ViewChild('inputSearch') public inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('periodFormSelect') public periodFormSelect!: ElementRef;
  @ViewChild('departmentSelect') public departmentSelect!: ElementRef;

  public studentsData: any[] = [];
  private selected = '';
  public periods?: Period[];
  public isLoading: boolean = false;
  private studentContracts!: Contract[];
  public periodData!: Period;
  private officeUserData!: OfficeUser;
  public officeUserAcademics!: any[];
  public filteredData: any = [];

  selectedDepartment: any = {
    academic_id: 0,
    department: ''
  };

  constructor(public officeService: OfficeService, public depManagerService: DepManagerService, public studentsService: StudentsService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

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
    });
  }

  formatDate = (date: any) => { return Utils.getAtlasPreferredTimestamp(date); }

  // This function is used to get the AM of the student
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  openEditPaymentOrderDialog(idx: any) {
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const dialogRef = this.dialog.open(EditPaymentOrderDialogComponent, {
      data: { studentsData: studentFinalData, index: idx }, width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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

  onPeriodChange(value: any) {
    this.isLoading = true;
    this.selected = value;
    this.studentsData = [];
    this.filteredData = [];

    let periodId = value ? value : 0;
    console.log(this.selectedDepartment.academic_id);
    this.officeService.getStudentPaymentsListForPeriodAndAcademic(this.selectedDepartment.academic_id, periodId)
      .subscribe((students: any) => {
          // this.studentsData.splice(0, this.studentsData.length);
          this.studentsData = students;
          for (let i = 0; i < students.length; i++) {
            if (this.studentsData[i].status == -1) {
              this.studentsData.splice(i, 1);
            }
            this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
            this.studentsData[i].user_ssn = students[i].user_ssn;
          }

          this.isLoading = false;
    });
  }

  onDepartmentChange(value: any) {
    this.isLoading = true;
    this.periods = [];
    this.selectedDepartment = value;
    this.studentsData = [];
    this.filteredData = [];

    this.depManagerService.getAllPeriodsByDepartmentId(Number(this.selectedDepartment.academic_id))
      .subscribe({
        next:(periods: any[]) => {
          this.periods = periods;
          this.isLoading = false;
        }, error: (error: any) => {
          console.log(error);
          this.isLoading = false;
        }
      });
  }

  downloadPaymentOrderFileForStudent(studentId: number, index: number) {
    if (this.studentsData[index].status != 1) {
      Swal.fire({ title: 'Αποτυχία', text: "Πρέπει να ολοκληρωθεί η ΠΑ (στην καρτέλα \"Συμβάσεις\") για να βγάλετε εντολή πληρωμής", icon: 'warning' });
      return;
    }

    let initialPeriod: any = !this.periods || !this.periods[0] ? 0 : this.periods[0].id;

    this.depManagerService.receivePaymentOrderFile(studentId, this.selected ? this.selected: initialPeriod , this.officeUserData?.department_id, "docx")
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
        
        if (this.studentsData[studentIndex]?.status != 1) {
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
}
