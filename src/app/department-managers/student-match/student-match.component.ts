import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {mergeMap} from 'rxjs';
import {Utils} from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import Swal from 'sweetalert2';
import {ActiveApplication} from '../active-application.model';
import { DepManagerService } from '../dep-manager.service';
import * as XLSX from 'xlsx';
import {Period} from '../period.model';
import {StudentsMatchedInfoDialogComponent} from '../students-matched-info-dialog/students-matched-info-dialog.component';
import {StudentsPositionAssignmentDialogComponent} from '../students-position-assignment-dialog/students-position-assignment-dialog.component';

@Component({
  selector: 'app-student-match',
  templateUrl: './student-match.component.html',
  styleUrls: ['./student-match.component.css']
})
export class StudentMatchComponent implements OnInit {
  @ViewChild('studentsTable') table: ElementRef | undefined;
  studentsData: Student[] = [];
  activeApplications!: ActiveApplication[];
  applicationDateStr!: string[];
  selected = '';
  ngSelect = "";
  @Input() period: Period | undefined;

  constructor(public depManagerService: DepManagerService, private chRef: ChangeDetectorRef, private translate: TranslateService, public dialog: MatDialog) { }

  dtOptions: any = {};

  ngOnInit() {
    this.depManagerService.getDepManager()
      .pipe(
        mergeMap((result: { department_id: number; }) =>
          this.depManagerService.getStudentActiveApplications(result?.department_id))
      )
      .subscribe((application: ActiveApplication[]) => {
        this.activeApplications = application;

        for (let application of this.activeApplications) {
          application.reg_code = this.getAM(application.reg_code);
          application.applicationDateStr = Utils.reformatDateToEULocaleStr(application.application_date);
        }
        // TODO: When provider assigns students, need to fetch the provider name

        // Have to wait till the changeDetection occurs. Then, project data into the HTML template
        this.chRef.detectChanges();

        // Use of jQuery DataTables
        const table: any = $('#studentsTable');
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
          columnDefs: [{ orderable: false, targets: [4] }]
        });
      });
  }

  private getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  exportToExcel() {
    let studentsDataJson: any = [];
    for (const item of this.activeApplications) {
      studentsDataJson.push({
        "Επώνυμο": item.lastname,
        "Όνομα": item.firstname,
        "Πατρώνυμο": item.father_name,
        "Μητρώνυμο": item.mother_name,
        "Επώνυμο πατέρα": item.father_last_name,
        "Επώνυμο μητέρας": item.mother_last_name,
        "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.date_of_birth),
        // "Έτος γέννησης": item.schacyearofbirth,
        "ΑΜ": item.reg_code,
        "Φύλο": item.gender == 1 ? 'Άνδρας' : 'Γυναίκα',
        // "Τηλέφωνο": item.phone,
        // "Πόλη": item.city,
        // "ΤΚ": item.post_address,
        // "Διεύθυνση": item.address,
        // "Τοποθεσία": item.location,
        // "Χώρα": item.country == "gr" ? 'Ελλάδα' : item.country,
        // "ΑΦΜ": item.ssn,
        // "AMKA": item.user_ssn,
        // "ΔΟΥ": item.doy,
        // "IBAN": item.iban,
        // "Εκπαίδευση": item.education,
        // "Άλλη εκπαίδευση": item.other_edu,
        // "Γνώσεις Η/Υ": item.computer_skills,
        // "skills": item.skills,
        // "honors": item.honors,
        // "Εμπειρία": item.experience,
        // "Γλώσσες": item.languages,
        // "Ενδιαφέροντα": item.interests,
        // "Υπηρετώ στο στρατό ": item.military_training == true ? 'ΝΑΙ' : 'ΟΧΙ',
        // "AMEA κατηγορίας 5 ": item.amea_cat == true ? 'ΝΑΙ' : 'ΟΧΙ',
        // "Σύμβαση εργασίας ": item.working_state == true ? 'ΝΑΙ' : 'ΟΧΙ',
        // "Αποτελέσματα": (item.phase == 2 ? 'Επιλέχτηκε' : item.phase == 1 ? 'Προς επιλογή' : 'Απορρίφτηκε')
        // "edupersonorgdn": item.edupersonorgdn,
      });
    }

    const excelFileName: string = "StudentsActiveApplications.xlsx";
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
    let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write("<h5 style='text-align: right;'>" + currentDate + "</h5><br>");
    windowPrint?.document.write("<table style=\"width: 100%;\"> \
        <thead style=\"color:white; background-color:#2d4154;\"> \
          <tr> \
            <th>Αριθμός Αίτησης</th> \
            <th>Ημερομηνία Αίτησης</th> \
            <th>Oναματεπώνυμο</th> \
            <th>ΑΜ</th> \
            <th>Επιλογές Φοιτητή</th> \
            <th>Αποδοχή Φορέα</th> \
          </tr> \
        </thead>");

    let i = 0;
    for (let student of this.activeApplications) {
      let studentChoices = '';
      for (let j = 0; j < student.positions.length; j++) {
        studentChoices += (j + 1) + "." + student.positions[j].company + "<br>";
      }

      windowPrint?.document.write(
        // print the rows - another color for the odd lines - could be done with i % 2 != 0
        // but with bitwise operator it was a bit faster
        "<tr " + ((i & 1) ? "style=\"background-color: #f3f3f3;\">" : ">") +
        "<td>" + student.app_id + "</td>" +
        "<td>" + student.application_date + "</td>" +
        "<td>" + student.lastname + " " + student.firstname + "</td>" +
        "<td>" + student.reg_code + "</td>" +
        "<td>" + studentChoices + "</td>" +
        "<td>" + "2.citrix" + "</td>" +
        "</tr>");
      i++;
    }
    windowPrint?.document.write("</table>")
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

  openDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(StudentsMatchedInfoDialogComponent, {
      data: { index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openPositionSelectionDialog(appId: any, assignMode: string) {
    console.log(appId);
    const dialogRef = this.dialog.open(StudentsPositionAssignmentDialogComponent, {
      data: { appId: appId, assignMode: assignMode }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
