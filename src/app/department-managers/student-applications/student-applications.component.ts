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
  constructor(public depManagerService: DepManagerService, private chRef: ChangeDetectorRef) { }

  dtOptions : any = {};

  ngOnInit() {
    this.depManagerService.getStudentsApplyPhase()
      .subscribe((students: Student[]) => {
        this.studentsData = students;
        console.log(students);

      // Have to wait till the changeDetection occurs. Then, project data into the HTML template
      this.chRef.detectChanges();

      // Use of jQuery DataTables
      const table: any = $('#example');
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
        processing: true
        // pageLength: 8,
        // dom: 'Bfrtip',
              // buttons: [
              //   {
              //     extend: 'collection',
              //     text: 'Export',
              //     buttons: [
              //       'copy',
              //       'excel',
              //       'csv',
              //       'pdf',
              //       'print'
              //     ]
              //   }
              // ]
        });
      });

      // this.dtOptions = {
      //   pagingType: 'full_numbers',
      //   pageLength: 8,
      //   processing: true,
      //   dom: 'Bfrtip',
      //   buttons: [ 'copy', 'csv', 'excel', 'print' ]
      // };
  }

  exportToExcel(){
    // const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table?.nativeElement);
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet((document.getElementById("example") as HTMLElement));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }

  ngAfterViewInit(): void {
    // $('#example').DataTable();
  }

}

