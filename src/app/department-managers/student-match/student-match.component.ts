import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Student } from 'src/app/students/student.model';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';
declare const $: any;

@Component({
  selector: 'app-student-match',
  templateUrl: './student-match.component.html',
  styleUrls: ['./student-match.component.css']
})
export class StudentMatchComponent implements OnInit, AfterViewInit {
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  studentsData: Student[] = [];
  // dataSource = ELEMENT_DATA;
  selected = '';
  ngSelect = "";
  table: any;
  constructor(public depManagerService: DepManagerService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  dtOptions: any = {};

  ngOnInit() {
    // this.depManagerService.receiveFile().subscribe(res => {
    //  window.open(window.URL.createObjectURL(res));
    //  });
    this.depManagerService.getStudentsApplyPhase()
      .subscribe((students: Student[]) => {
        this.studentsData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
          this.studentsData[i].schacpersonaluniqueid = this.getAM(students[i].schacpersonaluniqueid);
        }
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
          columnDefs: [{ orderable: false, targets: [6, 7] }],
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
      });
  }
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

}
