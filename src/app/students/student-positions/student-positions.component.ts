import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { StudentPositions } from '../student-positions.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-student-positions',
  templateUrl: './student-positions.component.html',
  styleUrls: ['./student-positions.component.css']
})
export class StudentPositionsComponent implements OnInit {
  studentPositions!: StudentPositions[];
  //sortedArray!: StudentPositions[];

  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getStudentPositions()
      .subscribe((forms: StudentPositions[]) => {
        this.studentPositions = forms;
        console.log(this.studentPositions);
      });
  }

  swapUp(positionPriority: number): void {
    let positionIndex: number = (positionPriority - 1);
    if (positionIndex <= 0) return;

    const swap: number = this.studentPositions[positionIndex].priority;
    const swapObj: StudentPositions = this.studentPositions[positionIndex];
    this.studentPositions[positionIndex].priority = this.studentPositions[positionIndex - 1].priority;
    this.studentPositions[positionIndex] = this.studentPositions[positionIndex - 1];
    this.studentPositions[positionIndex - 1].priority = swap;
    this.studentPositions[positionIndex - 1] = swapObj;
  }

  swapDown(positionPriority: number): void {
    let positionIndex: number = (positionPriority - 1);
    if (positionIndex + 1 >= this.studentPositions.length) return;

    const swap: number = this.studentPositions[positionIndex].priority;
    const swapObj: StudentPositions = this.studentPositions[positionIndex];
    this.studentPositions[positionIndex].priority = this.studentPositions[positionIndex + 1].priority;
    this.studentPositions[positionIndex] = this.studentPositions[positionIndex + 1];
    this.studentPositions[positionIndex + 1].priority = swap;
    this.studentPositions[positionIndex + 1] = swapObj;
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

  // isOutOfBounds(index: number, studentPositions: any[]): boolean {
  //   return (index + 1 >= studentPositions.length || index <= 0);
  // }

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

}
