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

  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getStudentPositions()
      .subscribe((forms: StudentPositions[]) => {
        this.studentPositions = forms;
        console.log(this.studentPositions);
      });
  }

  myAlert() {
    Swal.fire({
      title: 'Οριστικοποίηση Αίτησης',
      text: 'Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Είστε σίγουροι ότι θέλετε να προχωρήσετε;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

}
