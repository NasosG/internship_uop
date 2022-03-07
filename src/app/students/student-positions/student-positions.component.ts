import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';
import { Application } from '../application.model';
import { StudentPositions } from '../student-positions.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-student-positions',
  templateUrl: './student-positions.component.html',
  styleUrls: ['./student-positions.component.css']
})
export class StudentPositionsComponent implements OnInit {
  studentPositions!: StudentPositions[];
  studentApplications!: Application[];

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    // this.studentsService.getStudentPositions()
    //   .subscribe((forms: StudentPositions[]) => {
    //     this.studentPositions = forms;
    //   });
    this.applicationsCreator(this.studentsService.getStudentPositions(), 0);
    this.applicationsCreator(this.studentsService.getStudentApplications(), 1);
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
      .slideUp( 600 )
      .slideDown( 600 );
  }

  /**
   *
   * @param ms time in milliseconds
   * @returns Promise<void>
   */
  async delay(ms: number): Promise<void>{
    await new Promise( resolve => setTimeout(resolve, ms) );
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
}
