import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';
import { OfficeService } from '../office.service';
import { SheetInputOfficeDialogComponent } from '../sheet-input-office-dialog/sheet-input-office-dialog.component';
import { SheetInputOfficeEditDialogComponent } from '../sheet-input-office-edit-dialog/sheet-input-office-edit-dialog.component';
import { OfficeUser } from '../office-user.model';
import { Period } from 'src/app/department-managers/period.model';
import { DepManagerService } from 'src/app/department-managers/dep-manager.service';
import { catchError, of } from 'rxjs';
import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-sheet-input-office',
  templateUrl: './sheet-input-office.component.html',
  styleUrls: ['./sheet-input-office.component.css']
})
export class SheetInputOfficeComponent implements OnInit {

  @ViewChild('sheetInputTable') public sheetInputTable: ElementRef | undefined;
  @ViewChild('inputSearch') public inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('periodFormSelect') public periodFormSelect!: ElementRef;
  @ViewChild('departmentSelect') public departmentSelect!: ElementRef;
  public studentsData: Student[] = [];
  private selected = '';
  public periods?: Period[];
  public isLoading: boolean = false;
  public periodData!: Period;
  public officeUserData!: OfficeUser;
  public officeUserAcademics!: any[];
  public filteredData: any = [];

  selectedDepartment: any = {
    academic_id: 0,
    department: ''
  };

  constructor(public officeService: OfficeService, public depManagerService: DepManagerService, public studentsService: StudentsService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.officeService.getOfficeUser()
      .subscribe((officeUser: OfficeUser) => {
        this.officeUserData = officeUser;

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

  // This function is used to get the AM of the student
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  openDialog(idx: any) {
    if (!this.officeUserData?.is_admin) {
      Utils.displayErrorPrivilegesSwal('Δεν έχετε δικαίωμα διαχειριστή ώστε να δείτε το δελτίο του φοιτητή.');
      return;
    }
    console.log(idx);
    const dialogRef = this.dialog.open(SheetInputOfficeDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(idx: any) {
    if (!this.officeUserData?.is_admin) {
      Utils.displayErrorPrivilegesSwal('Δεν έχετε δικαίωμα διαχειριστή ώστε να επεξεργαστείτε το δελτίο του φοιτητή.');
      return;
    }
    console.log(idx);
    const dialogRef = this.dialog.open(SheetInputOfficeEditDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  submitOPSDialog(studentId: any, type: string) {
    console.log(studentId);
    if (!this.officeUserData?.is_admin) {
      Utils.displayErrorPrivilegesSwal('Δεν έχετε δικαίωμα διαχειριστή ώστε να ανεβάσετε το δελτίο στο ΟΠΣ.');
      return;
    }

    this.officeService.sendSheetWS(studentId, type).subscribe((res: any) => {
      if (res.status == 200) {

        if(res.message == 'deactivated') {
          alert("Currently deactivated");
          return;
        }

        Utils.displaySuccessSwal('Το δελτίο ανέβηκε με επιτυχία.');
      } else {
        Utils.displayErrorSwal('Παρουσιάστηκε κάποιο πρόβλημα κατά την ανέβασμα του δελτίου.');
      }
    });
  }

  onPeriodChange(value: any) {
    this.isLoading = true;
    this.selected = value;
    this.studentsData = [];
    this.filteredData = [];

    let periodId = value ? value : 0;
    console.log(this.selectedDepartment.academic_id);
    this.officeService.getStudentsWithSheetInput(periodId)
      .pipe(
        catchError((error: any) => {
          console.error(error);
          this.isLoading = false;

          return of([]);
        })
      )
      .subscribe((students: any) => {
          // this.studentsData.splice(0, this.studentsData.length);
          this.studentsData = students;
          for (let i = 0; i < students.length; i++) {
            this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
            this.studentsData[i].user_ssn = students[i].user_ssn;
          }

          this.isLoading = false;
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

}
