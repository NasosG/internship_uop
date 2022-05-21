import { AfterViewInit, Component, OnInit } from '@angular/core';

declare const $:any;

@Component({
  selector: 'app-student-applications',
  templateUrl: './student-applications.component.html',
  styleUrls: ['./student-applications.component.css']
})
export class StudentApplicationsComponent implements OnInit, AfterViewInit {

  constructor() { }

  dtOptions : any = {};

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'print'
      ]
    };
  }

  randomNumber() {
     //return Math.floor(Math.random() * 1000000);
  }

  ngAfterViewInit(): void {

    // $('#example').DataTable();
  //   $('#example1').DataTable({
  //   dom: 'Bfrtip',

  //         select: true,
  //           colReorder: true,
  //             buttons: [

  //               {
  //                 extend: 'collection',
  //                 text: 'Export',
  //                 buttons: [
  //                   'copy',
  //                   'excel',
  //                   'csv',
  //                   'pdf',
  //                   'print'
  //                 ]
  //               }
  //             ]
  // } );
      // $('#example2').DataTable({
      //   "paging": true,
      //   "lengthChange": false,
      //   "searching": false,
      //   "ordering": true,
      //   "info": true,
      //   "autoWidth": false,
      //   "responsive": true,
      // });
  }

}
