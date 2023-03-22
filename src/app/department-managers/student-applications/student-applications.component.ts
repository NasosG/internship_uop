import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import * as XLSX from 'xlsx';
import { StudentAppsPreviewDialogComponent } from '../student-apps-preview-dialog/student-apps-preview-dialog.component';
import { DepManagerService } from '../dep-manager.service';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from '../period.model';
import Swal from 'sweetalert2';
import { fromEvent } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-student-applications',
  templateUrl: './student-applications.component.html',
  styleUrls: ['./student-applications.component.css']
})
export class StudentApplicationsComponent implements OnInit, AfterViewInit {
  @ViewChild('example') table: ElementRef | undefined;
  @ViewChild('photo') image!: ElementRef;
  @ViewChild('btnRunAlgorithm') btnRunAlgorithm!: ElementRef;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  selected = '';
  ngSelect = "";
  @Input() period: Period|undefined;
  hasMadeComment: any = [];
  btnDisabled: boolean = false;
  screenWidth: number = 1800;
  isActive = false;

  constructor(public depManagerService: DepManagerService, public authService: AuthService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    // for the responsive table
    this.screenWidth = window.innerWidth;
    fromEvent(window, 'resize')
      .subscribe(() => {
        this.screenWidth = window.innerWidth;
      });

    this.depManagerService.getStudentsApplyPhase()
      .subscribe((students: Student[]) => {

        const studentWithPhaseZero = students.find(student => student.phase !== -1 && student.phase !== 2);
        this.btnDisabled = studentWithPhaseZero !== undefined;

        this.studentsData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
          this.studentsData[i].user_ssn = students[i].user_ssn;

          // fetch comments of each student
          this.depManagerService.getCommentByStudentIdAndSubject(this.studentsData[i].sso_uid, 'Δικαιολογητικά')
            .subscribe((comment: any) => {
                if (comment) {
                  this.hasMadeComment.push({studentId: this.studentsData[i].sso_uid, hasComment: true});
                } else {
                  this.hasMadeComment.push({studentId: this.studentsData[i].sso_uid, hasComment: false});
                }
            });
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
          pagingType: 'full_numbers',
          processing: true,
          columnDefs: [{ orderable: false, targets: [8, 10] }],
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

  redirectToResults() {
    if (!this.period?.phase_state) return;
    if (this.period?.phase_state <= 1 && moment(new Date()).isSameOrBefore(this.period.date_to, 'day')) {
      Swal.fire({
        title: 'Έλεγχος αποτελεσμάτων',
        text: 'Δεν μπορείτε να βγάλετε αποτελέσματα εφόσον η φάση αιτήσεων δεν έχει λήξει'
      });
      return;
    }

    if (this.btnDisabled) {
      Swal.fire({
        title: 'Έλεγχος αποτελεσμάτων',
        text: 'Η κατάσταση κάποιων αιτήσεων είναι "Προς Επιλογή". Παρακαλούμε επεξεργαστείτε όλες τις αιτήσεις πριν βγάλετε αποτελέσματα'
      });
      return;
    }

    if (!this.period.department_id) return;
    this.depManagerService.insertApprovedStudentsRank(this.period.department_id, this.period.phase_state, this.period.id);
  }

  runAlgorithm() {
    if (!this.period?.phase_state) return;
    if (!this.btnDisabled) {
      if (!this.period.department_id) return;
      // this.depManagerService.insertApprovedStudentsRank(this.period.department_id, this.period.phase_state, this.period.id)
      // .subscribe(
      //   (response) => {
      //     console.log('insertApprovedStudentsRank success:', response);
      //     return response;
      //   },
      //   (error) => {
      //     console.log('insertApprovedStudentsRank error:', error);
      //     return false;
      //   }
      // );
    }
    return false;
  }

  checkStudentHasComment(studentSSOUid: number): boolean {
    const studentComment =  this.hasMadeComment.find((comment: {studentId: number; hasComment: boolean}) => comment.studentId === studentSSOUid);
    return (studentComment && studentComment.hasComment);
  }

  periodHasNotEnded() {
    return moment(new Date()).isSameOrBefore(this.period?.date_to, 'day');
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
  // downloadFile(data: any) {
  //   let blob = new Blob([data]);
  //   let url = window.URL.createObjectURL(blob);
  //   let pwa = window.open(url);
  //   if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
  //       alert('Please disable your Pop-up blocker and try again.');
  //   }
  // }

  ngAfterViewInit(): void {
    // $('#example').DataTable();
  }

  onSubmitSelect(option: string, studentId: number) {
    // this.validateFormData(formData);
    let phase;
    phase = (option == "option1") ? 2 : (option == "option2") ? -1: 1;
    console.log("phase: " + phase + " stId: " + (studentId));
    const periodId = this.period?.id ? this.period.id : null;
    this.depManagerService.updatePhaseByStudentId(phase, studentId, periodId);

    this.depManagerService.getStudentsApplyPhase().subscribe((students: Student[]) => {
      const studentWithPhaseZero = students.find(student => student.phase !== -1 && student.phase !== 2);
      this.btnDisabled = studentWithPhaseZero !== undefined;
    });

    // this.onSavePeriodAlert();
  }

  openDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(StudentAppsPreviewDialogComponent, {
      // width: '350px',
      data: { studentsData: this.studentsData, index: idx }
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

}
