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
import {CompanysActiveApplications} from '../companys-active-applications.model';

@Component({
  selector: 'companies-students-applications',
  templateUrl: './students-applications.component.html',
  styleUrls: ['./students-applications.component.css']
})
export class StudentsApplicationsComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable') table: ElementRef | undefined;
  company!: Company;
  apps: CompanysActiveApplications[] = [];
  studentApprovalBtns: Map<string, boolean> = new Map<string, boolean>();

  constructor(private chRef: ChangeDetectorRef, public dialog: MatDialog, public companyService: CompanyService) { }

  dtOptions: any = {};

  ngOnInit() {
    this.companyService
      .getProviderById()
      .subscribe((company: Company) => {
        this.company = company;
        console.log(this.company);

        this.companyService
          .getStudentActiveApplications(this.company.name, this.company.afm)
          .subscribe((apps: CompanysActiveApplications[]) => {
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

  changeSelectedColor(selectElementId: string, student_id: number, position_id: number) {
    const inputField = <HTMLInputElement>document.getElementById(selectElementId);
    const index = Number(selectElementId.substring(3));
    console.log(index);

    const tupleKey = position_id + ',' + student_id;

    if (inputField.value === "ΟΧΙ") {
      this.studentApprovalBtns.delete(tupleKey);
      inputField.classList?.add("text-danger");
      inputField.classList?.remove("text-success");
    } else {
      this.studentApprovalBtns.set(tupleKey, false);
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
    }).then((result) => {
      if (!result.isConfirmed) {
        console.log("User pressed Cancel");
      } else {
        let positionsDataJson: Assignment[] = [];

        for (let position of this.apps) {
          const tupleKey = position.position_id + ',' + position.student_id;
          if (!this.studentApprovalBtns.has(tupleKey)) {
            continue;
          }

          // TODO: Check for duplicates
          // Check if the position is already in the positionsDataJson array
          // if (positionsDataJson.some(p => p.position_id === position.position_id)) {
          //   continue;
          // }

          positionsDataJson.push({
            position_id: position.position_id,
            internal_position_id: position.internal_position_id,
            title: position.title,
            city: position.place,
            duration: position.duration,
            physical_object: position.physical_objects,
            student_id: position.student_id,
            department_id: position.department_id,
            period_id: position.period_id,
          });
        }

        // Inform the user and don't send the request, if positions array is empty
        if (positionsDataJson.length === 0) {
          Swal.fire({
            title: 'Αποτυχία',
            text: 'Δεν έχετε αποδεχτεί κανέναν φοιτητή',
            icon: 'error',
            confirmButtonText: 'ΟΚ'
          });
        } else {
          this.companyService.insertAssignment(positionsDataJson).subscribe(responseData => {
            console.log(responseData.message);
            location.reload();
            //this.ngOnInit();
          }), (error: any) => {
            console.log(error);
            alert("Η αποδοχή των φοιτητών απέτυχε");
          };
        }
      }
    });
  }

  exportToExcel() {
    let positionsDataJson: any = [];

    for (let position of this.apps) {
      positionsDataJson.push({
        "Θέση": position.title,
        "Επώνυμο": position.lastname,
        "Όνομα": position.firstname,
        "Πατρώνυμο": position.father_name,
        "Μητρώνυμο": position.mother_name,
        "Επώνυμο πατέρα": position.father_last_name,
        "Επώνυμο μητέρας": position.mother_last_name,
        // "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(position.date_of_birth),
        "Τμήμα": position.department
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
      // width: '350px',
      data: { application: data, positionTitle: positionTitle }
    });
  }
}
