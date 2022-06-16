import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'companies-students-applications',
  templateUrl: './students-applications.component.html',
  styleUrls: ['./students-applications.component.css']
})
export class StudentsApplicationsComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable') table: ElementRef | undefined;

  constructor(private chRef: ChangeDetectorRef) { }

  dtOptions: any = {};

  ngOnInit() {
    this.chRef.detectChanges();

    // Use of jQuery DataTables
    const table: any = $('#appTable');
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
      columnDefs: [{ orderable: false, targets: [3, 5, 6] }],
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
    // $('#example1').DataTable();

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
      title: 'Αποδοχή Φοιτητών',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην επιλογή των φοιτητών;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

}
