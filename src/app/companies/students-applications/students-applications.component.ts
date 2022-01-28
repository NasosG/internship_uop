import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'companies-students-applications',
  templateUrl: './students-applications.component.html',
  styleUrls: ['./students-applications.component.css']
})
export class StudentsApplicationsComponent implements OnInit, AfterViewInit {

  constructor() { }

  dtOptions: any = {};

  ngOnInit() { }

  randomNumber() {
    return Math.floor(Math.random() * 1000000);
  }

  changeSelectedColor() {
    // var alphas = new Array;
    // const inputField = (<HTMLInputElement>document.getElementsByClassName("kl")[0]);

    // for (let i=0; i<inputField.value.length; i++) {
    //   let inputValue = (<HTMLInputElement>document.getElementsByClassName("kl")[i]).value

    //   alert(inputValue );
    //   if (inputValue == "ΟΧΙ") {
    //     inputField.classList?.add("text-danger");
    //     inputField.classList?.remove("text-success");
    //   }
    //   else {
    //     inputField.classList?.add("text-success");
    //     inputField.classList?.remove("text-danger");
    //   }
    // }

    // let inputValue = (<HTMLInputElement>document.getElementsByClassName("kl")[0]).value;
    // alert (inputValue);

  }


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
      title: 'Επιλογή θέσεων',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στη προσθήκη φοιτητών;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

}
