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
import Swal from 'sweetalert2';
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
  private periodIdAfterChange: number | null = null;

  constructor(public depManagerService: DepManagerService, public studentsService: StudentsService, public authService: AuthService, private chRef: ChangeDetectorRef, private elRef: ElementRef, private translate: TranslateService, public dialog: MatDialog) { }

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
    this.periodIdAfterChange = value;

    this.depManagerService.getStudentListForPeriod(value)
    .subscribe({
      next: (students: any[]) => {
        this.studentsData = students.map(student => ({
          ...student,
          schacpersonaluniquecode: this.getAM(student.schacpersonaluniquecode),
          user_ssn: student.user_ssn
        }));

        this.isLoading = false;

        // Trigger change detection to update the template with new data
        this.chRef.detectChanges();

        // Show all results by changing the page length to -1
        const table = $(this.elRef.nativeElement).find('#contractsTable');
        table.DataTable().page.len(-1).draw();
      }, error: (error: any) => {
          console.log(error);
          this.isLoading = false;
      }
    });
  }

  downloadContractFileForStudent(studentId: number) {
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
      if (result === Utils.CustomDialogAction.OK) {
        let initialPeriod = this.periods != null ? this.periods[0].id : null;
        this.onPeriodChange(this.periodIdAfterChange || initialPeriod);
      }
    });
  }

  private turnTimestampToDatePrint(timestamp: any) {
    return moment(timestamp).format('DD/MM/YYYY');
  }

  printCompletionCertificate(idx: number, student: any) {
    if (!student) return;
    let studentName = student.givenname + " " + student.sn;

    const imageUrls = [
      'assets/images/logoPaymentOrder.jpg',
      'assets/images/espaImage2a.jpg'
    ];

    const imagePromises = imageUrls.map(url => Utils.getBase64Image(url));

    Promise.all(imagePromises).then(base64Images => {
      const [image1, image2] = base64Images;

      const pdfContent = `
      <html>
      <div style="display: flex; justify-content: center;">
        <img style="width:400px;" src="${image1}" alt="UOP Logo" >
      </div>
      <div style="text-align: center">
        <p style="color:#2d05ce">Σύστημα Κεντρικής Υποστήριξης της Πρακτικής Άσκησης Φοιτητών</p><br>
        <strong>Βεβαίωση Ολοκλήρωσης Πρακτικής Άσκησης</strong><br><br>
      </div>
      <div>
      Βεβαιώνεται ότι ο/η ${studentName} φοιτητής/τρια στο τμήμα ${student.dept_name} του Ιδρύματος ΠΑΝΕΠΙΣΤΗΜΙΟ
      ΠΕΛΟΠΟΝΝΗΣΟΥ με Αριθμό Μητρώου ${student.schacpersonaluniquecode} <br><br>
      ολοκλήρωσε την Πρακτική Άσκηση:<br>
      ${student.assigned_position_id} - ${student.pa_subject}<br><br>
      στο χρονικό διάστημα ${this.turnTimestampToDatePrint(student.pa_start_date)} εώς ${this.turnTimestampToDatePrint(student.pa_end_date)}<br><br>
      στον Φορέα Υποδοχής Πρακτικής Άσκησης ${student.asgmt_company_name}.<br><br>
      Ως επόπτης για την εκπόνηση της εν λόγω Πρακτικής Άσκησης ανέλαβε ο/η ${student.company_liaison ?? ''}.
      </div>
      <br><br><br>
      <div style="display: flex; justify-content: center;">
        <img style="width: 320px;" src="${image2}" alt="UOP Logo" >
      </div>
      </html>`;

      const filename = `completion_certificate_${studentName}.html`;
      const pdfBlob = new Blob([pdfContent]);
      const xmlURL = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = xmlURL;
      downloadLink.download = filename;
      downloadLink.click();

      // Clean up
      URL.revokeObjectURL(xmlURL);
      downloadLink.remove();
    });
  }

}
