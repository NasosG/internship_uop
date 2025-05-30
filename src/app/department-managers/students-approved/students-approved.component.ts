import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import * as XLSX from 'xlsx';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepManagerService } from '../dep-manager.service';
import { mergeMap } from 'rxjs';
import { StudentsAppsPreviewDialogComponent } from '../students-apps-preview-dialog/students-apps-preview-dialog.component';
import { Period } from '../period.model';
import Swal from 'sweetalert2';
import { BankUtils } from 'src/app/BankUtils';

@Component({
  selector: 'app-students-approved',
  templateUrl: './students-approved.component.html',
  styleUrls: ['./students-approved.component.css']
})
export class StudentsApprovedComponent implements OnInit, AfterViewInit {
  @ViewChild('example') table: ElementRef | undefined;
  @ViewChild('photo') image!: ElementRef;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  selected = '';
  ngSelect = "";
  depId: any;
  @Input('espaPositions') espaPositions: number = 0;
  @Input('period') period: Period | undefined;
  @Input('periodId') periodId: number = 0;
  constructor(public depManagerService: DepManagerService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .pipe(
        mergeMap((result: { department_id: number; }) =>
          this.depManagerService.getRankedStudentsByDeptId(result?.department_id, this.periodId))
      )
      .subscribe((students: Student[]) => {
        this.studentsData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
          this.studentsData[i].user_ssn = students[i].user_ssn;
        }
        // Have to wait till the changeDetection occurs. Then, project data into the HTML template
        this.chRef.detectChanges();

        // Use of jQuery DataTables
        const table: any = $('#example');
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
          // orderable: true,
          // columnDefs: [{ orderable: false, targets: [5] }],
          pagingType: 'full_numbers',
          processing: true,
          language: {
            // lengthMenu: 'Show _MENU_ entries'
            // lengthMenu: this.translate.instant('DEPT-MANAGER.SHOW-RESULTS') + ' _MENU_ ' + this.translate.instant('DEPT-MANAGER.ENTRIES')
            // : "Επίδειξη","ENTRIES": "εγγραφών ανά σελίδα"
            // // lengthMenu: 'Display _MENU_ records per page',
            // zeroRecords: 'Nothing found - sorry',
            // info: 'Showing page _PAGE_ of _PAGES_',
            // infoEmpty: 'No records available',
            // infoFiltered: '(filtered from _MAX_ total records)',
          },
          // pageLength: 8
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

  exportToExcel() {
    let studentsDataJson: any = [];
    for (const item of this.studentsData) {
      studentsDataJson.push({
        "Κατάταξη": item.ranking,
        "Αποτέλεσμα": (item.is_approved ? 'Επιτυχών' : 'Επιλαχών'),
        "Βαθμολογία(στα 100)": item.score,
        "AMEA κατηγορίας 5 ": item.amea_cat == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "ΑΜ": item.schacpersonaluniquecode,
        "email": item.mail,
        "Επώνυμο": item.sn,
        "Όνομα": item.givenname,
        "Πατρώνυμο": item.father_name,
        "Μητρώνυμο": item.mother_name,
        "Επώνυμο πατέρα": item.father_last_name,
        "Επώνυμο μητέρας": item.mother_last_name,
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
        "ΑΔΤ": item.id_card,
        //"Εκπαίδευση": item.education,
        //"Άλλη εκπαίδευση": item.other_edu,
        //"Γνώσεις Η/Υ": item.computer_skills,
        //"skills": item.skills,
        //"honors": item.honors,
        //"Εμπειρία": item.experience,
        //"Γλώσσες": item.languages,
        //"Ενδιαφέροντα": item.interests,
        "Υπηρετώ στο στρατό ": item.military_training == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "Σύμβαση εργασίας ": item.working_state == true ? 'ΝΑΙ' : 'ΟΧΙ'
        // "Αποτελέσματα": (item.phase == 2 ? 'Επιλέχτηκε' : item.phase == 1 ? 'Προς επιλογή' : 'Απορρίφτηκε')
      });
    }

    const excelFileName: string = "StudentsApproved.xlsx";
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
           <th>Αρ. Κατάταξης</th> \
            <th>Αποτέλεσμα </th> \
            <th>Όνοματεπώνυμο</th> \
            <th>ΑΜ</th> \
            <th>Σκορ</th> \
            <th>ΑΜΕΑ</th> \
          </tr> \
        </thead>");

    let i = 0;
    for (let student of this.studentsData) {
      windowPrint?.document.write(
        // print the rows - another color for the odd lines - could be done with i % 2 != 0
        // but with bitwise operator it was a bit faster
        "<tr " + ((i & 1) ? "style=\"background-color: #f3f3f3;\">" : ">") +
        "<td>" + student.ranking + "</td>" +
        "<td>" + (student.is_approved ? 'Επιτυχών' : 'Επιλαχών') + "</td>" +
        "<td>" + student.sn + " " + student.givenname + "</td>" +
        "<td>" + student.schacpersonaluniquecode + "</td>" +
        "<td>" + student.score + "</td>" +
        "<td>" + (student.amea_cat == true ? 'ΝΑΙ' : 'OXI') + "</td>" +
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
    const dialogRef = this.dialog.open(StudentsAppsPreviewDialogComponent, {
      // width: '350px',
      data: { studentsData: this.studentsData, index: idx }
    });
  }

  async swapUp(studentRanking?: number): Promise<void> {
    if (!studentRanking) return;
    let positionIndex: number = (studentRanking - 1);
    if (positionIndex <= 0) return;

    this.animate(studentRanking);
    console.log(positionIndex);
    //this.animate(positionPriority-1);

    await this.delay(600);
    this.swapUpLogic(positionIndex);
    this.depManagerService.updateStudentRanking(this.studentsData, this.periodId);
  }

  async swapDown(studentRanking?: number): Promise<void> {
    if (!studentRanking) return;
    let positionIndex: number = (studentRanking - 1);
    if (positionIndex + 1 >= this.studentsData.length) return;

    this.animate(studentRanking);
    console.log(positionIndex);
    //this.animate(positionPriority+1);

    await this.delay(600);
    this.swapDownLogic(positionIndex);
    this.depManagerService.updateStudentRanking(this.studentsData, this.periodId);
  }

  swapUpLogic(positionIndex: number): void {
    const tempRank: any = this.studentsData[positionIndex].ranking;
    const tempObj: Student = this.studentsData[positionIndex];
    this.studentsData[positionIndex].ranking = this.studentsData[positionIndex - 1].ranking;
    this.studentsData[positionIndex] = this.studentsData[positionIndex - 1];
    this.studentsData[positionIndex - 1].ranking = tempRank;
    this.studentsData[positionIndex - 1] = tempObj;
    // Change is approved status
    this.studentsData[positionIndex].is_approved = this.checkIsApproved(this.studentsData[positionIndex].ranking, tempRank);
    this.studentsData[positionIndex - 1].is_approved = this.checkIsApproved(tempRank, this.studentsData[positionIndex - 1].ranking);
  }

  swapDownLogic(positionIndex: number): void {
    const tempRank: any = this.studentsData[positionIndex].ranking;
    const tempObj: Student = this.studentsData[positionIndex];
    this.studentsData[positionIndex].ranking = this.studentsData[positionIndex + 1].ranking;
    this.studentsData[positionIndex] = this.studentsData[positionIndex + 1];
    this.studentsData[positionIndex + 1].ranking = tempRank;
    this.studentsData[positionIndex + 1] = tempObj;
    // Change is approved status
    this.studentsData[positionIndex].is_approved = this.checkIsApproved(this.studentsData[positionIndex].ranking, tempRank);
    this.studentsData[positionIndex + 1].is_approved = this.checkIsApproved(tempRank, this.studentsData[positionIndex + 1].ranking);
  }

  checkIsApproved(studentRanking: number | undefined, statementNum: number | undefined): boolean {
    const ESPA_POSITIONS = this.espaPositions;
    if (!statementNum) return false;
    if (!studentRanking) return false;
    return (statementNum <= ESPA_POSITIONS);
  }

  animate(positionPriority: number): void {
    $('#example tr#row' + positionPriority)
      .find('td')
      .wrapInner('<div style="display: block;" />')
      .parent()
      .find('td > div')
      // .fadeOut(400)
      // .fadeIn(400);
      .slideUp(600)
      .slideDown(600);
  }

  /**
   *
   * @param ms time in milliseconds
   * @returns Promise<void>
   */
  async delay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy(): void {
    this.destroyDataTable();
  }

  destroyDataTable(): void {
    if ($.fn.DataTable()) {
      $('#example').DataTable().destroy();
    }
  }

  runAlgorithm() {
    this.depManagerService.getDepManager()
      .pipe(
        mergeMap((result: { department_id: number; }) =>
          this.depManagerService.insertApprovedStudentsRank(result?.department_id, this.period?.phase_state as any, this.periodId)
        )
      )
      .subscribe((students: any) => {
        Swal.fire({
          title: 'Ανανέωση Αποτελεσμάτων',
          text: 'Είστε σίγουροι ότι θέλετε να ανανεώσετε τα αποτελέσματα; Αν έχετε κάνει αλλαγές στις προτεραιότητες, θα γίνει επαναφορά στην αρχική τους κατάσταση.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then((result) => {
          if (result.isConfirmed) {
            this.destroyDataTable();
            this.ngOnInit();
          }
        });
      });
  }
}
