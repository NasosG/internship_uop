import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
  constructor(public depManagerService: DepManagerService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .pipe(
        mergeMap((result: { department_id: number; }) =>
          this.depManagerService.getRankedStudentsByDeptId(result?.department_id))
      )
      .subscribe((students: Student[]) => {
        this.studentsData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
          this.studentsData[i].user_ssn = this.getAM(students[i].user_ssn);
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
          ordering: true,
          info: true,
          autoWidth: false,
          responsive: true,
          select: true,
          orderable: true,
          columnDefs: [{ orderable: false, targets: [5] }],
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
    // this.depManagerService.receiveFile();
    this.depManagerService.receiveFile(studentId, docType).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

  exportToExcel() {
    let studentsDataJson: any = [];
    for (const item of this.studentsData) {
      studentsDataJson.push({
        "Κατάταξη": item.ranking,
        "Σκορ": item.score,
        "Επώνυμο": item.sn,
        "Όνομα": item.givenname,
        "Πατρώνυμο": item.father_name,
        "Μητρώνυμο": item.mother_name,
        "Επώνυμο πατέρα": item.father_last_name,
        "Επώνυμο μητέρας": item.mother_last_name,
        "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.schacdateofbirth),
        "Έτος γέννησης": item.schacyearofbirth,
        "ΑΜ": item.schacpersonaluniquecode,
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
        "IBAN": item.iban,
        "Εκπαίδευση": item.education,
        "Άλλη εκπαίδευση": item.other_edu,
        "Γνώσεις Η/Υ": item.computer_skills,
        "skills": item.skills,
        "honors": item.honors,
        "Εμπειρία": item.experience,
        "Γλώσσες": item.languages,
        "Ενδιαφέροντα": item.interests,
        "Υπηρετώ στο στρατό ": item.military_training == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "AMEA κατηγορίας 5 ": item.amea_cat == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "Σύμβαση εργασίας ": item.working_state == true ? 'ΝΑΙ' : 'ΟΧΙ',
        "Αποτελέσματα": (item.phase == 2 ? 'Επιλέχτηκε' : item.phase == 1 ? 'Προς επιλογή' : 'Απορρίφτηκε')
        // "edupersonorgdn": item.edupersonorgdn,
      });
    }

    const excelFileName: string = "StudentsPhase1.xlsx";
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


  onSubmitSelect(option: string, studentId: number) {
    // this.validateFormData(formData);
    let phase;
    phase = (option == "option1") ? 2 : -1;
    console.log("phase: " + phase + " stId: " + (studentId));
    this.depManagerService.updatePhaseByStudentId(phase, studentId);
    // this.onSavePeriodAlert();
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
    this.depManagerService.updateStudentRanking(this.studentsData, this.depManagerService.getDepartmentId());
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
    this.depManagerService.updateStudentRanking(this.studentsData, this.depManagerService.getDepartmentId());
  }

  swapUpLogic(positionIndex: number): void {
    const tempRank: any = this.studentsData[positionIndex].ranking;
    const tempObj: Student = this.studentsData[positionIndex];
    this.studentsData[positionIndex].ranking = this.studentsData[positionIndex - 1].ranking;
    this.studentsData[positionIndex] = this.studentsData[positionIndex - 1];
    this.studentsData[positionIndex - 1].ranking = tempRank;
    this.studentsData[positionIndex - 1] = tempObj;
  }

  swapDownLogic(positionIndex: number): void {
    const tempRank: any = this.studentsData[positionIndex].ranking;
    const tempObj: Student = this.studentsData[positionIndex];
    this.studentsData[positionIndex].ranking = this.studentsData[positionIndex + 1].ranking;
    this.studentsData[positionIndex] = this.studentsData[positionIndex + 1];
    this.studentsData[positionIndex + 1].ranking = tempRank;
    this.studentsData[positionIndex + 1] = tempObj;
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
}
