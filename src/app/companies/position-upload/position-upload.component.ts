import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-position-upload',
  templateUrl: './position-upload.component.html',
  styleUrls: ['./position-upload.component.css']
})
export class PositionUploadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  fireTheWhole() {
    Swal.fire({
      title: 'Οριστικοποίηση θέσεων',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην οριστικοποίηση των θέσεων για πρακτική άσκηση;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }
}
