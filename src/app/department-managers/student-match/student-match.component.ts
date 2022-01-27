import { AfterViewInit, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
declare const $:any;

@Component({
  selector: 'app-student-match',
  templateUrl: './student-match.component.html',
  styleUrls: ['./student-match.component.css']
})
export class StudentMatchComponent implements OnInit, AfterViewInit {

  constructor() { }

  dtOptions: any = {};

  ngOnInit() {
    // do nothing
  }

  editStudent() {
    Swal.fire({
      title: 'Αποτέλεσμα',
      text: 'Επιτυχής αντιστοίχηση φοιτητή με φορέα',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  randomNumber() {
    return Math.floor(Math.random() * 1000000);
  }

  ngAfterViewInit(): void {
    $('#example').DataTable();
  }

}
