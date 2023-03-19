import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import {Period} from '../period.model';
import { SheetInputPreviewDialogComponent } from '../sheet-input-preview-dialog/sheet-input-preview-dialog.component';

@Component({
  selector: 'app-student-contracts',
  templateUrl: './student-contracts.component.html',
  styleUrls: ['./student-contracts.component.css']
})
export class StudentContractsComponent implements OnInit {
 @ViewChild('contractsTable') contractsTable: ElementRef | undefined;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: any[] = [];
  selected = '';
  ngSelect = '';
  depManagerData: DepManager | undefined;
  studentName!: string;
  periods: Period[] | undefined;
  isLoading: boolean = false;

  constructor(public depManagerService: DepManagerService, public studentsService: StudentsService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

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
                  ordering: true,
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

  onSubmitSelect(option: string, studentId: number) {
    // this.validateFormData(formData);
    let phase;
    phase = (option == "option1") ? 2 : (option == "option2") ? -1 : 1;
    console.log("phase: " + phase + " stId: " + (studentId));
    this.depManagerService.updatePhaseByStudentId(phase, studentId);
    // this.onSavePeriodAlert();
  }

  openEditContractDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(SheetInputPreviewDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // onPeriodChange(event: any) {
  //   this.selected = event.target.value;

  //   console.log(this.selected);
  // }

  onPeriodChange(value: any) {
    this.isLoading = true;
    this.selected = value;
    this.depManagerService.getStudentListForPeriod(47)
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

  downloadContractFileForStudent(studentId: number) {
    alert(this.selected);
    let initialPeriod: any = !this.periods || !this.periods[0] ? 0 : this.periods[0].id;

     this.depManagerService.receiveContractFile(studentId, this.selected ? this.selected: initialPeriod , this.depManagerData?.department_id, "docx")
     .subscribe(res => {
        window.open(window.URL.createObjectURL(res));
      });
  }
}
