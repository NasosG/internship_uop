import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-selected-students',
  templateUrl: './selected-students.component.html',
  styleUrls: ['./selected-students.component.css']
})
export class SelectedStudentsComponent implements OnInit, AfterViewInit {

  constructor() { }

  dtOptions: any = {};

  ngOnInit() { }

  randomNumber() {
    return Math.floor(Math.random() * 1000000);
  }

  changeSelectedColor() { }

  ngAfterViewInit(): void {
    $('#example1').DataTable();

    $('.kl').change(function () {
      if ($(this).val() === "ΟΧΙ") {
        $(this).addClass("text-danger");
        $(this).removeClass("text-success");
      }
      else {
        $(this).toggleClass("text-success");
        $(this).removeClass("text-danger");
      }
    })
  }


  fireTheWhole() {
    Swal.fire({
      title: 'Ακύρωση Επιλογών',
      text: 'Είστε σίγουροι ότι θέλετε να ακυρώσετε τους επιλεγμένους φοιτητές και να επιλέξετε νέους;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }
}
