import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import { SheetQuestionnairesOfficeEditDialogComponent } from '../sheet-questionnaires-office-edit-dialog/sheet-questionnaires-office-edit-dialog.component';
import { Period } from 'src/app/department-managers/period.model';
import { OfficeUser } from '../office-user.model';
import { DepManagerService } from 'src/app/department-managers/dep-manager.service';
import { OfficeService } from '../office.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-sheet-questionnaires-office',
  templateUrl: './sheet-questionnaires-office.component.html',
  styleUrls: ['./sheet-questionnaires-office.component.css']
})
export class SheetQuestionnairesOfficeComponent implements OnInit {
  @ViewChild('questionnairesTable') public questionnairesTable: ElementRef | undefined;
  @ViewChild('inputSearch') public inputElement!: ElementRef<HTMLInputElement>;

  public studentsData: Student[] = [];
  public selected = '';
  public ngSelect = '';
  private officeUserData!: OfficeUser;
  public periods: Period[] | undefined;
  public isLoading: boolean = false;
  public filteredData: any = [];
  public isSortDirectionUp: boolean = true;
  public activeBtns: boolean[] = [false, false];


  @ViewChild('periodFormSelect') public periodFormSelect!: ElementRef;
  @ViewChild('departmentSelect') public departmentSelect!: ElementRef;

  public officeUserAcademics!: any[];

  selectedDepartment: any = {
    academic_id: 0,
    department: ''
  };


  constructor(public officeService: OfficeService, public depManagerService: DepManagerService, public authService: AuthService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.officeService.getOfficeUser()
      .subscribe((officeUser: OfficeUser) => {
        this.officeUserData = officeUser;

        this.selectedDepartment.department = this.selectedDepartment.department == null ? this.officeUserData.department : this.selectedDepartment.department;
        this.selectedDepartment.academic_id = this.selectedDepartment.department == null ? this.officeUserData.department_id : this.selectedDepartment.academic_id;

        this.officeService.getAcademicsByOfficeUserId()
        .subscribe((academics: any) => {
          this.officeUserAcademics = academics;
      });
    });
  }

  // This function is used to get the AM of the student
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  downloadEvaluationDocx(studentId: number, docType: string) {
    this.depManagerService.receiveEvaluationFormFile(studentId, docType).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

  openDialog(idx: any) {
    console.log(idx);
    let studentFinalData = (this.filteredData.length ? this.filteredData : this.studentsData);
    const dialogRef = this.dialog.open(SheetQuestionnairesOfficeEditDialogComponent, {
      data: { studentsData: studentFinalData, index: idx }, width: '50%',
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

   onPeriodChange(value: any) {
      this.isLoading = true;
      this.selected = value;
      this.studentsData = [];
      this.filteredData = [];

      console.log(this.selectedDepartment.academic_id);
      this.depManagerService.getStudentsWithQuestionnaires(value)
        .pipe(
          catchError((error: any) => {
            console.error(error);
            this.isLoading = false;

            return of([]);
          })
        )
        .subscribe((students: any) => {
            this.studentsData = students;
            for (let i = 0; i < students.length; i++) {
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
          next: (periods: any[]) => {
            this.periods = periods;
            this.isLoading = false;
          }, error: (error: any) => {
            console.log(error);
            this.isLoading = false;
          }
        });
    }
}
