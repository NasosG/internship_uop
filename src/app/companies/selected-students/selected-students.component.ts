import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { ActiveApplicationsRanked } from '../active-applications-ranked.model';
import { Company } from '../company.model';
import { CompanyService } from '../company.service';
import * as XLSX from 'xlsx';
import { Utils } from 'src/app/MiscUtils';
import { ApplicationsPreviewDialogComponent } from '../applications-preview-dialog/applications-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Assignment } from '../assignment.model';
import { CompanysActiveApplications } from '../companys-active-applications.model';
import {CompanyEvaluationDialogComponent} from '../company-evaluation-dialog/company-evaluation-dialog.component';

@Component({
  selector: 'app-selected-students',
  templateUrl: './selected-students.component.html',
  styleUrls: ['./selected-students.component.css']
})
export class SelectedStudentsComponent implements OnInit {
  @ViewChild('selectedAppsTable') table: ElementRef | undefined;
  company!: Company;
  apps: CompanysActiveApplications[] = [];

  constructor(private chRef: ChangeDetectorRef, public dialog: MatDialog, public companyService: CompanyService) { }

  dtOptions: any = {};

  ngOnInit() {
    this.companyService
      .getProviderById()
      .subscribe((company: Company) => {
        this.company = company;
        console.log(this.company);

        this.companyService
          .getStudentAssignedApplications(this.company.name, this.company.afm)
          .subscribe((apps: CompanysActiveApplications[]) => {
            this.apps = apps;
            this.chRef.detectChanges();
            const table: any = $('#selectedAppsTable');
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
              columnDefs: [{ orderable: false, targets: [3, 5] }],
              language: {}
            });
          });
      });
  }

  cancelSelection() {
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

  exportToExcel() {
    let positionsDataJson: any = [];

    for (const item of this.apps) {
        positionsDataJson.push({
          "θεση": item.title,
          "Επώνυμο": item.lastname,
          "Όνομα": item.firstname,
          "Πατρώνυμο": item.father_name,
          "Μητρώνυμο": item.mother_name,
          "Επώνυμο πατέρα": item.father_last_name,
          "Επώνυμο μητέρας": item.mother_last_name,
          // "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.date_of_birth),
          "ΑΦΜ": item.ssn,
          "ΑΜΚΑ": item.user_ssn,
          "Τμήμα": item.department
        });
    }

    const excelFileName: string = "Positions.xlsx";
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(positionsDataJson) //table_to_sheet((document.getElementById("example") as HTMLElement));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Save to file */
    XLSX.writeFile(wb, excelFileName);
  }

  openDialog(data: ActiveApplicationsRanked, positionTitle: string) {
    const dialogRef = this.dialog.open(ApplicationsPreviewDialogComponent, {
      data: { application: data, positionTitle: positionTitle }
    });
  }

  openEvaluationDialog(data: ActiveApplicationsRanked, positionTitle: string, studentId: number, positionId: number) {
    console.log(positionId, studentId);
    const dialogRef = this.dialog.open(CompanyEvaluationDialogComponent, {
      data: { application: data, positionTitle: positionTitle, studentId, positionId },
      maxWidth: '1200px'
    });
  }
}
