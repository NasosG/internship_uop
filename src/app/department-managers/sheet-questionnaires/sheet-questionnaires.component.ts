import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { Period } from '../period.model';
import { SheetQuestionnairesEditDialogComponent } from '../sheet-questionnaires-edit-dialog/sheet-questionnaires-edit-dialog.component';

@Component({
  selector: 'app-deptmanager-questionnaires',
  templateUrl: './sheet-questionnaires.component.html',
  styleUrls: ['./sheet-questionnaires.component.css']
})
export class SheetQuestionnairesComponent implements OnInit {

  @ViewChild('questionnairesTable') public questionnairesTable: ElementRef | undefined;
  @ViewChild('inputSearch') public inputElement!: ElementRef<HTMLInputElement>;

  public studentsData: Student[] = [];
  public selected = '';
  public ngSelect = '';
  private depManagerData: DepManager | undefined;
  public periods: Period[] | undefined;
  public isLoading: boolean = false;
  public filteredData: any = [];
  public isSortDirectionUp: boolean = true;
  public activeBtns: boolean[] = [false, false];

  constructor(public depManagerService: DepManagerService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;

        this.depManagerService.getAllPeriodsByDepartmentId(this.depManagerData.department_id)
          .subscribe((periods: any[]) => {
            this.periods = periods;

            this.depManagerService.getStudentsWithQuestionnaires(this.periods[0].id)
              .subscribe((students: any[]) => {
                this.studentsData = students;
                for (let i = 0; i < students.length; i++) {
                  this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
                  this.studentsData[i].user_ssn = students[i].user_ssn;
                }
          });
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
    const dialogRef = this.dialog.open(SheetQuestionnairesEditDialogComponent, {
      data: { studentsData: this.studentsData, index: idx }, width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onPeriodChange(value: any) {
    this.isLoading = true;
    this.selected = value;

    this.depManagerService.getStudentsWithQuestionnaires(value)
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
}
