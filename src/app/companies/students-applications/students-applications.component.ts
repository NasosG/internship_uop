import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { ActiveApplicationsRanked } from '../active-applications-ranked.model';
import { Company } from '../company.model';
import { CompanyService } from '../company.service';
import * as XLSX from 'xlsx';
import { Utils } from 'src/app/MiscUtils';
import { ApplicationsPreviewDialogComponent } from '../applications-preview-dialog/applications-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'companies-students-applications',
  templateUrl: './students-applications.component.html',
  styleUrls: ['./students-applications.component.css']
})
export class StudentsApplicationsComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable') table: ElementRef | undefined;
  company!: Company;
  apps: ActiveApplicationsRanked[] = [];

  constructor(private chRef: ChangeDetectorRef, public dialog: MatDialog, public companyService: CompanyService) { }

  dtOptions: any = { };

  ngOnInit() {
    this.companyService
      .getProviderById()
      .subscribe((company: Company) => {
        this.company = company;
        console.log(this.company);

        this.companyService
          .getStudentActiveApplications(this.company.name, this.company.afm)
          .subscribe((apps: ActiveApplicationsRanked[]) => {
            this.apps = apps;
            this.chRef.detectChanges();
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
              columnDefs: [{ orderable: false, targets: [3, 5, 6, 7] }],
              language: {}
            });
        });
      });
  }

  changeSelectedColor(selectElementId: string) {
    const inputField = <HTMLInputElement>document.getElementById(selectElementId);
    if (inputField.value === "ΟΧΙ") {
      inputField.classList?.add("text-danger");
      inputField.classList?.remove("text-success");
    } else {
      inputField.classList?.add("text-success");
      inputField.classList?.remove("text-danger");
    }
  }

  ngAfterViewInit(): void { }

  submitApplications() {

    this.onSubmitSwal();
  }

  onSubmitSwal() {
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

  exportToExcel() {
    let positionsDataJson: any = [];

    for (const item of this.apps) {
      for (let position of item.positions) {
        positionsDataJson.push({
          "θεση": position.title,
          "Επώνυμο": item.lastname,
          "Όνομα": item.firstname,
          "Πατρώνυμο": item.father_name,
          "Μητρώνυμο": item.mother_name,
          "Επώνυμο πατέρα": item.father_last_name,
          "Επώνυμο μητέρας": item.mother_last_name,
          "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.date_of_birth)
        })
      }
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
      // width: '350px',
      data: { application: data, positionTitle: positionTitle }
    });
  }
}
