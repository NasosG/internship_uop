import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import {Utils} from 'src/app/MiscUtils';
import {Student} from 'src/app/students/student.model';
import * as XLSX from 'xlsx';

import {MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  selected = '';
  ngSelect = "";
  constructor(public depManagerService: DepManagerService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions : any = {};

  ngOnInit() {
    this.depManagerService.getStudentsApplyPhase()
      .subscribe((students: Student[]) => {
        this.studentsData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsData[i].schacpersonaluniquecode = this.getAM(students[i].schacpersonaluniquecode);
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

  // This function is used to get the AM of the student
  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  exportToExcel() {
    let studentsDataJson:any = [];
    for (const item of this.studentsData) {
      studentsDataJson.push({
        "Επώνυμο": item.sn,
        "Όνομα": item.givenname,
        "ΑΜ": item.schacpersonaluniquecode,
        "Φύλο": item.schacgender == 1 ? 'Άνδρας' : 'Γυναίκα',
        "Έτος γέννησης": item.schacyearofbirth,
        "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.schacdateofbirth),
        "Πατρώνυμο": item.father_name,
        "Επώνυμο πατέρα": item.father_last_name,
        "Μητρώνυμο": item.mother_name,
        "Επώνυμο μητέρας": item.mother_last_name,
        "ΑΦΜ": item.ssn,
        "ΔΟΥ": item.doy,
        "IBAN": item.iban,
        "Εκπαίδευση": item.education,
        "Εμπειρία": item.experience,
        "Γλώσσες": item.languages,
        "Γνώσεις Η/Υ": item.computer_skills,
        "Άλλη εκπαίδευση": item.other_edu,
        "honors": item.honors,
        "Ενδιαφέροντα": item.interests,
        "skills": item.skills,
        "Τηλέφωνο": item.phone,
        "Διεύθυνση": item.address,
        "Τοποθεσία": item.location,
        "Πόλη": item.city,
        "ΤΚ": item.post_address,
        "Χώρα": item.country == "gr" ? 'Eλλάδα' : item.country,
        "Αποτελέσματα": (item.phase == 2 ? 'Επιλέχτηκε' : item.phase == 1 ? 'Προς επιλογή' : 'Απορρίφτηκε')
        // "edupersonorgdn": item.edupersonorgdn,
      });
    }

    const excelFileName: string = "StudentsPhase1.xlsx";
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson) //table_to_sheet((document.getElementById("example") as HTMLElement));
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
            <th>Όνοματεπώνυμο</th> \
            <th>Πατρώνυμο</th> \
            <th>ΑΜ</th> \
            <th>email</th> \
            <th>Κατάσταση</th> \
          </tr> \
        </thead>");

    let i = 0;
    for (let student of this.studentsData) {
      windowPrint?.document.write(
      // print the rows - another color for the odd lines - could be done with i % 2 != 0
      // but with bitwise operator it was a bit faster
        "<tr " + ( (i & 1) ? "style=\"background-color: #f3f3f3;\">" : ">" ) +
                "<td>" + student.sn + " " + student.givenname + "</td>" +
                "<td>" + student.father_name + "</td>" +
                "<td>" + student.schacpersonaluniquecode + "</td>" +
                "<td>" + student.id + "@uop.gr" + "</td>" +
                "<td>" + (student.phase == 2 ? 'Επιλέχτηκε' : student.phase == 1 ? 'Προς επιλογή' : 'Απορρίφτηκε') + "</td>" +
      "</tr>");
      i++;
    }
    windowPrint?.document.write("</table>")
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }


  onSubmitSelect(option: string, studentId: number) {
    // this.validateFormData(formData);
    let phase;
    if (option == "option1")
      phase = 2;
    else phase = -1;
    console.log("phase: " + phase + " stId: " + (studentId));
    this.depManagerService.updatePhaseByStudentId(phase, studentId);
    // this.onSavePeriodAlert();
  }



  openDialog(idx:any) {
    // console.log(idx);
    const dialogRef = this.dialog.open(StudentAppsPreviewDialog, {
      // width: '350px',
      data: {studentsData: this.studentsData, index: idx}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'student-apps-preview-dialog.html',
  styleUrls: ['student-apps-preview-dialog.css']
})
export class StudentAppsPreviewDialog {

  public dateOfBirth: string = Utils.reformatDateOfBirth(this.data.studentsData[this.data.index].schacdateofbirth);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<StudentAppsPreviewDialog>) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}

