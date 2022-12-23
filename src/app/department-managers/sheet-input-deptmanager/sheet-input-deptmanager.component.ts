import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { SheetInputPreviewDialogComponent } from '../sheet-input-preview-dialog/sheet-input-preview-dialog.component';
import { StudentAppsPreviewDialogComponent } from '../student-apps-preview-dialog/student-apps-preview-dialog.component';


@Component({
  selector: 'app-sheet-input-deptmanager',
  templateUrl: './sheet-input-deptmanager.component.html',
  styleUrls: ['./sheet-input-deptmanager.component.css']
})
export class SheetInputDeptmanagerComponent implements OnInit {
  @ViewChild('sheetInputTable') sheetInputTable: ElementRef | undefined;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  selected = '';
  ngSelect = '';
  depManagerData: DepManager | undefined;
  studentName!: string;

  constructor(public depManagerService: DepManagerService, public studentsService: StudentsService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;

        this.depManagerService.getStudentsWithSheetInput(this.depManagerData.department_id)
          .subscribe((students: any[]) => {
            this.studentsData = students;
            for (let i = 0; i < students.length; i++) {
              this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
              this.studentsData[i].user_ssn = students[i].user_ssn;
            }
            // Have to wait till the changeDetection occurs. Then, project data into the HTML template
            this.chRef.detectChanges();

            // Use of jQuery DataTables
            const table: any = $('#sheetInputTable');
            this.sheetInputTable = table.DataTable({
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
              pagingType: 'full_numbers',
              processing: true,
              columnDefs: [{ orderable: false, targets: [6, 7] }]
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

  onSubmitSelect(option: string, studentId: number) {
    // this.validateFormData(formData);
    let phase;
    phase = (option == "option1") ? 2 : (option == "option2") ? -1 : 1;
    console.log("phase: " + phase + " stId: " + (studentId));
    this.depManagerService.updatePhaseByStudentId(phase, studentId);
    // this.onSavePeriodAlert();
  }

  openDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(SheetInputPreviewDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '50%',
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

  printInputSheet(idx: any) {
    let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
    const printContent = document.getElementById("entrySheetPreviewContent");
    this.studentsData = [...this.studentsService.students];
    this.studentName = this.studentsData[0].givenname + " " + this.studentsData[0].sn;
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write((printContent?.innerHTML == null) ? '' : printContent?.innerHTML);
    windowPrint?.document.write("<br><br><br><br><br><h3 style='text-align: right;'>Υπογραφή</h3>");
    windowPrint?.document.write("<h5 style='text-align: right;'>" + currentDate + "</h5><br><br><br>");
    windowPrint?.document.write("<h5 style='text-align: right;'>" + this.studentName + "</h5>");
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }
}
