import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {Student} from 'src/app/students/student.model';
 import * as XLSX from 'xlsx';
import {DepManagerService} from '../dep-manager.service';




@Component({
  selector: 'app-student-applications',
  templateUrl: './student-applications.component.html',
  styleUrls: ['./student-applications.component.css']
})
export class StudentApplicationsComponent implements OnInit, AfterViewInit {
  @ViewChild('example') table: ElementRef | undefined;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  // dataSource = ELEMENT_DATA;
  constructor( public depManagerService: DepManagerService,private chRef: ChangeDetectorRef) { }

  dtOptions : any = {};

  ngOnInit() {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 8,
    //   processing: true,
    //   dom: 'Bfrtip',
    //   buttons: [
    //     'copy', 'csv', 'excel', 'print'
    //   ]
    // };

    this.depManagerService.getStudentsApplyPhase()
      .subscribe((students: Student[]) => {
        this.studentsData = students;
        console.log(students);
        // You'll have to wait that changeDetection occurs and projects data into
      // the HTML template, you can ask Angular to that for you ;-)
      this.chRef.detectChanges();

      // Now you can use jQuery DataTables :
      const table: any = $('#example');
      this.table = table.DataTable();
        // this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
      });
  }

exportToExcel()
{
  // const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table?.nativeElement);
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet((document.getElementById("example") as HTMLElement));
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, 'SheetJS.xlsx');

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

