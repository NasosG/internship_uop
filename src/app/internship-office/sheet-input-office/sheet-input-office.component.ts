import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DepManager } from 'src/app/department-managers/dep-manager.model';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';
import { OfficeService } from '../office.service';
import { SheetInputOfficeDialogComponent } from '../sheet-input-office-dialog/sheet-input-office-dialog.component';
import { SheetInputOfficeEditDialogComponent } from '../sheet-input-office-edit-dialog/sheet-input-office-edit-dialog.component';

@Component({
  selector: 'app-sheet-input-office',
  templateUrl: './sheet-input-office.component.html',
  styleUrls: ['./sheet-input-office.component.css']
})
export class SheetInputOfficeComponent implements OnInit {

  @ViewChild('sheetInputTable') sheetInputTable: ElementRef | undefined;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  selected = '';
  ngSelect = '';
  depManagerData: DepManager | undefined;
  studentName!: string;

  constructor(public officeService: OfficeService, public studentsService: StudentsService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.officeService.getOfficeUser()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;

        this.officeService.getStudentsWithSheetInput(this.depManagerData.department_id)
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
              columnDefs: [{ orderable: false, targets: [3, 4] }]
            });
          });
      });
  }

  // This function is used to get the AM of the student
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  openDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(SheetInputOfficeDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(SheetInputOfficeEditDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
