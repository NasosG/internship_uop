import { Component, Input, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from 'src/app/department-managers/period.model';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { AcceptedAssignmentsByCompany } from '../accepted-assignments-by-company';
import { Application } from '../application.model';
import { StudentPositions } from '../student-positions.model';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExtraFieldsUpdateDialogComponent } from '../extra-fields-update-dialog/extra-fields-update-dialog.component';

@Component({
  selector: 'app-student-positions',
  templateUrl: './student-positions.component.html',
  styleUrls: ['./student-positions.component.css']
})
export class StudentPositionsComponent implements OnInit {
  @Input() amaValue: any;
  studentPositions!: StudentPositions[];
  studentApplications!: Application[];
  studentsData!: Student[];
  studentName!: string;
  period!: Period;
  dateFrom!: string;
  dateTo!: string;
  studentAtlasAssignments!: AcceptedAssignmentsByCompany[];
  canStudentDeleteApplication: boolean = false;
  isLoading: boolean = false;

  constructor(public studentsService: StudentsService, public authService: AuthService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.studentsService.getStudentPositions()
    //   .subscribe((forms: StudentPositions[]) => {
    //     this.studentPositions = forms;
    //   });
    this.applicationsCreator(this.studentsService.getStudentPositions(), 0);
    this.applicationsCreator(this.studentsService.getStudentApplications(), 1);
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsData = students;

        this.studentsService.getPhase(this.studentsData[0]?.department_id)
          .subscribe((period: Period) => {
            this.period = period;
            // this.dateFrom = Utils.reformatDateToEULocaleStr(this.period.date_from);
            // this.dateTo = Utils.reformatDateToEULocaleStr(this.period.date_to);
          });
      });

      this.studentsService.getAssignmentsByStudentId()
        .subscribe((assignments: any) => {
          this.studentAtlasAssignments = assignments;
          this.canStudentDeleteApplication = this.studentAtlasAssignments.length == 0;
        });
  }

  applicationsCreator(observablesArray: any, typeValue: any) {
    observablesArray.subscribe((forms: any[]) => {
      (typeValue == 0) ? this.studentPositions = forms : this.studentApplications = forms;
    });
  }

  async swapUp(positionPriority: number): Promise<void> {
    let positionIndex: number = (positionPriority - 1);
    if (positionIndex <= 0) return;

    this.animate(positionPriority);
    //this.animate(positionPriority-1);

    await this.delay(600);
    this.swapUpLogic(positionIndex);
  }

  async swapDown(positionPriority: number): Promise<void> {
    let positionIndex: number = (positionPriority - 1);
    if (positionIndex + 1 >= this.studentPositions.length) return;

    this.animate(positionPriority);
    //this.animate(positionPriority+1);

    await this.delay(600);
    this.swapDownLogic(positionIndex);
  }

  swapUpLogic(positionIndex: number): void {
    const swap: number = this.studentPositions[positionIndex].priority;
    const swapObj: StudentPositions = this.studentPositions[positionIndex];
    this.studentPositions[positionIndex].priority = this.studentPositions[positionIndex - 1].priority;
    this.studentPositions[positionIndex] = this.studentPositions[positionIndex - 1];
    this.studentPositions[positionIndex - 1].priority = swap;
    this.studentPositions[positionIndex - 1] = swapObj;
  }

  swapDownLogic(positionIndex: number): void {
    const swap: number = this.studentPositions[positionIndex].priority;
    const swapObj: StudentPositions = this.studentPositions[positionIndex];
    this.studentPositions[positionIndex].priority = this.studentPositions[positionIndex + 1].priority;
    this.studentPositions[positionIndex] = this.studentPositions[positionIndex + 1];
    this.studentPositions[positionIndex + 1].priority = swap;
    this.studentPositions[positionIndex + 1] = swapObj;
  }

  animate(positionPriority: number): void {
    $('#positionsTable > tr#row' + positionPriority)
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

  tempPositionsSave() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Οι θέσεις αποθηκεύτηκαν προσωρινά',
      showConfirmButton: false,
      timer: 1500
    });

    this.studentsService.updateStudentPositions(this.studentPositions);
  }

  deletePosition(positionPriority: number): void {
    let positionIndex: number = (positionPriority - 1);

    if (this.studentPositions.length == 1) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Η αίτηση πρέπει να περιέχει τουλάχιστον μία θέση',
        showConfirmButton: false,
        timer: 2500
      });
      return;
    }

    if (positionIndex == 0) {
      this.studentPositions.splice(positionIndex, 1);
      this.studentPositions.map(element => this.changePriority(element));
    } else if (positionIndex == this.studentPositions.length - 1) {
      this.studentPositions.pop();
    } else /*position is somewhere in the middle*/ {
      this.studentPositions.splice(positionIndex, 1);
      this.studentPositions.map(element => { if (element.priority > positionIndex) this.changePriority(element) });
    }

    //this.studentsService.deleteStudentPosition(positionPriority);
    //this.studentsService.updateStudentPositionPriorities(positionPriority);
  }

  changePriority(element: StudentPositions) {
    --element.priority;
    return element;
  }

  submitAlert() {
    Swal.fire({
      title: 'Οριστικοποίηση Αίτησης',
      text: 'Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Είστε σίγουροι ότι θέλετε να προχωρήσετε;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.amaValue) {
          Swal.fire({
            title: 'Απαιτείται Αριθμός ΑΜΑ-ΙΚΑ',
            text: 'Πρέπει να εισάγετε τον αριθμό ΑΜΑ-ΙΚΑ σας για να συνεχίσετε',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Εισαγωγή AMA',
            cancelButtonText: 'Back'
          }).then((result) => {
            if (result.isConfirmed) {
              this.openAMAInsertionDialog(1);
              //this.router.navigate(['student/contract-files/' + this.authService.getSessionId()]);
            }
          });

          return;
        }
        this.studentsService.checkPositionOfAtlasExists(this.studentPositions)
          .pipe(
            catchError((error: any) => {
              console.error('An error occurred:', error);
              const count = error.error.notExist.length;

              let errorMessage;
              if (count == 1) {
                errorMessage = 'Η θέση ' + error.error.notExistantPriorities + ' με κωδικό group ' + error.error.notExist + ' δεν υπάρχει πλέον στον ΑΤΛΑ';
              } else {
                errorMessage = 'Οι θέσεις ' + error.error.notExistantPriorities + ' με κωδικό group ' + error.error.notExist + ' δεν υπάρχουν πλέον στον ΑΤΛΑ';
              }

              if (error.error.message == "Position of atlas does not exist") {
                Swal.fire({
                  title: 'Αποτυχία Οριστικοποίησης',
                  text: errorMessage,
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'ΟΚ'
                });
              } else {
                Swal.fire({
                  title: 'Αποτυχία Οριστικοποίησης',
                  text: 'Παρουσιάστηκε κάποιο σφάλμα',
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'ΟΚ'
                });
              }

              throw error;
            })
          )
          .subscribe((response: any) => {
            this.studentsService.updateStudentPositions(this.studentPositions);
            this.studentsService.insertStudentApplication(this.studentPositions);
            this.studentsService.deleteStudentPositions(this.authService.getSessionId());
            Swal.fire({
              title: 'Επιτυχής καταχώρηση',
              text: 'Η αίτησή σας έχει δημιουργηθεί',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ΟΚ'
            }).then(() => { /* not the best technique */ location.reload(); });
          });
      }
    });
  }

  saveApp() {
    this.isLoading = true;
    this.studentsService.checkPositionOfAtlasExists(this.studentPositions)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          const count = error.error.notExist.length;

          let errorMessage;
          if (count == 1) {
            errorMessage = 'Η θέση ' + error.error.notExistantPriorities + ' με κωδικό group ' + error.error.notExist + ' δεν υπάρχει πλέον στον ΑΤΛΑ';
          } else {
            errorMessage = 'Οι θέσεις ' + error.error.notExistantPriorities + ' με κωδικό group ' + error.error.notExist + ' δεν υπάρχουν πλέον στον ΑΤΛΑ';
          }

          if (error.error.message == "Position of atlas does not exist") {
            Swal.fire({
              title: 'Αποτυχία Οριστικοποίησης',
              text: errorMessage,
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ΟΚ'
            });
          } else {
            Swal.fire({
              title: 'Αποτυχία Οριστικοποίησης',
              text: 'Παρουσιάστηκε κάποιο σφάλμα',
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ΟΚ'
            });
          }

          throw error;
        })
      )
      .subscribe((response: any) => {
        this.studentsService.updateStudentPositions(this.studentPositions);
        this.studentsService.insertStudentApplication(this.studentPositions);
        this.studentsService.deleteStudentPositions(this.authService.getSessionId());
        this.isLoading = false;
        Swal.fire({
          title: 'Επιτυχής καταχώρηση',
          text: 'Η αίτησή σας έχει δημιουργηθεί',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then(() => {
          /* not the best technique */
          location.reload();
        });
      });
  }

  openAMAInsertionDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(ExtraFieldsUpdateDialogComponent, {
      data: { studentsData: this.studentsData, index: idx },
      width: "800px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && Number(result) == 1) {
        this.saveApp();
      }
    });
  }

  deleteApplication(applicationId: number) {
    Swal.fire({
      title: 'Διαγραφή Αίτησης',
      text: 'Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Είστε σίγουροι ότι θέλετε να προχωρήσετε;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentsService.deleteApplicationById(applicationId);
        Swal.fire({
          title: 'Διαγραφή αίτησης',
          text: 'Η αίτησή σας έχει διαγραφεί και ορίζεται ως ανενεργή.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then(() => { /* not the best technique */ location.reload(); });
      }
    });
  }

  ngOnDestroy() {
    this.studentsService.updateStudentPositions(this.studentPositions);
  }

  getActiveStatus(): boolean {
    for (let i = 0; i < this.studentApplications.length; i++)
      if (this.studentApplications[i].application_status)
        return false;

    return true;
  }

  printApplicationSheet(appIndex: number) {
    this.studentsData = [...this.studentsService.students];
    this.studentName = this.studentsData[0].givenname + " " + this.studentsData[0].sn;
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write("<h3 style='text-align: center;'>" + this.studentName + "</h3><hr><br>");

    windowPrint?.document.write(
      "<h2>Αιτήσεις Φοιτητή/τριας</h2>" +
      "<table border='1' cellpadding='10'>" +
      "<tr>" +
      "<th>Αρ. Πρωτοκόλλου</th>" +
      "<th>Ημερομηνία Αίτησης</th>" +
      "<th>Κατάσταση Αίτησης</th>" +
      "</tr>" +
      "<tr>" +
      ` <td>${this.studentApplications[appIndex].protocol_number}</td>` +
      ` <td>${this.studentApplications[appIndex].application_date}</td>` +
      ` <td>${this.studentApplications[appIndex].application_status ? ' Ενεργή' : ' Ανενεργή'} </td>` +
      "</tr>" +
      "</table>" + "<br>" +
      "<h2>Θέσεις Φοιτητή/τριας</h2>" +
      "<table border='1' cellpadding='10'>" +
      "<tr>" +
      "<th>Προτεραιότητα</th>" +
      "<th>Εταιρεία</th>" +
      "<th>Τίτλος</th>" +
      "<th>Τοποθεσία</th>" +
      "<th>Ημερομηνία Δημοσίευσης</th>" +
      "</tr>" +
      ` ${this.studentApplications[appIndex].positions.map(element => {
        return '<tr>' +
          '<td>' + element.priority + '</td>' +
          '<td>' + element.company + '</td>' +
          '<td>' + element.title + '</td>' +
          '<td>' + element.place + '</td>' +
          '<td>' + element.upload_date + '</td>' +
          '</tr>'
      }).join('')}` +
      "</table>");

    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }
}
