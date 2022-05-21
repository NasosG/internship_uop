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
        processing: true,
        language: {
          // lengthMenu: 'Show _MENU_ entries'
          // // lengthMenu: 'Display _MENU_ records per page',
          // zeroRecords: 'Nothing found - sorry',
          // info: 'Showing page _PAGE_ of _PAGES_',
          // infoEmpty: 'No records available',
          // infoFiltered: '(filtered from _MAX_ total records)',
        },
        // pageLength: 8
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

  exportToExcel() {
    const excelFileName: string = "StudentPhase1.xlsx";
    // const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table?.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet((document.getElementById("example") as HTMLElement));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Save to file */
    XLSX.writeFile(wb, excelFileName);
  }

  ngAfterViewInit(): void {
    // $('#example').DataTable();
  }

  printDataTable() {
    let currentDate = new Date().toJSON().slice(0,10).split('-').reverse().join('/');
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write("<h5 style='text-align: right;'>"+ currentDate +"</h5><br>");
    windowPrint?.document.write("<table style=\"width: 100%;\"> \
        <thead style=\"color:white; background-color:#2d4154;\"> \
          <tr> \
            <th>Όνομα</th> \
            <th>email</th> \
            <th></th> \
            <th> Κατάσταση </th> \
          </tr> \
        </thead>");

    let i = 0;
    for (let student of this.studentsData) {
      windowPrint?.document.write(
      // print the rows - another color for the odd lines - could be done with i % 2 != 0
      // but with bitwise operator it was a bit faster
        "<tr " + ( (i & 1) ? "style=\"background-color: #f3f3f3;\">" : ">" ) +
                "<td>" + student.sn + " " + student.givenname + "</td>" +
                "<td>" + student.id + "@uop.gr" + "</td>" +
                "<td>" + student.sn + "</td>" +
                "<td>" + 'Ενεργή' + "</td>" +
      "</tr>");
      i++;
    }
    windowPrint?.document.write("</table>")
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

}

