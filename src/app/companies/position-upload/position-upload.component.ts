import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-position-upload',
  templateUrl: './position-upload.component.html',
  styleUrls: ['./position-upload.component.css']
})
export class PositionUploadComponent implements OnInit {
  physicalObjectForm = new FormControl('');
  list: string[] = ['option1', 'option2', 'option3', 'option4', 'option5', 'option6'];
  constructor() { }

  ngOnInit(): void {
    let element: any = document.getElementById("multiple-selected");
    element.selectpicker();
  }

  fireTheWhole() {
    Swal.fire({
      title: 'Ανάρτηση Θέσεων',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην τελική ανάρτηση των θέσεων για πρακτική άσκηση;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }
}
