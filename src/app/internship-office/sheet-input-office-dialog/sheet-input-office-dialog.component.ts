import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepManagerService } from 'src/app/department-managers/dep-manager.service';
import { SheetInputPreviewDialogComponent } from 'src/app/department-managers/sheet-input-preview-dialog/sheet-input-preview-dialog.component';
import { Utils } from 'src/app/MiscUtils';
import { EntryForm } from 'src/app/students/entry-form.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sheet-input-office-dialog',
  templateUrl: './sheet-input-office-dialog.component.html',
  styleUrls: ['./sheet-input-office-dialog.component.css']
})
export class SheetInputOfficeDialogComponent implements OnInit {
  public entryForms: EntryForm[] = [];
  public unemployedOption = Utils.unemployedOption;
  public privateSecOptions = Utils.privateSecOptions;
  public publicSecOptions = Utils.publicSecOptions;
  // A4.1 option can be found on the html
  public jobRelationOtherThanAbove = Utils.jobRelationOtherThanAbove;
  public specialJobOptions = Utils.specialJobOptions;
  public educationOptions = Utils.educationOptions;
  public educationalStandardOptions = Utils.educationalStandardOptions;
  public demographicsOptions = Utils.demographicsOptions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public departmentManagerService: DepManagerService,
    public dialogRef: MatDialogRef<SheetInputPreviewDialogComponent>
  ) { }

  ngOnInit(): void {
    this.departmentManagerService.getStudentEntrySheetsByStudentId(this.data.studentsData[this.data.index].uuid)
      .subscribe((forms: EntryForm[]) => {
        this.entryForms = forms;
        console.log(this.entryForms);
      });
  }

  onSubmitStudentEntrySheet(formData: FormData) {
    this.onSaveInputSheetSwal(formData);
  }

  onSaveInputSheetSwal(formData: FormData) {
    Swal.fire({
      title: 'Είστε σίγουρος/η;',
      text: 'Θα αποθηκευτεί το φύλλο εισαγωγής στο σύστημα',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, αποθήκευση!',
      cancelButtonText: 'Άκυρο'
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  printInputSheet() {
    let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
    const printContent = document.getElementById("entrySheetPreviewContent");
    // this.data.studentsData = [...this.studentsService.students];
    let studentFirstName = this.data.studentsData[0].givenname;
    let studentLastName = this.data.studentsData[0].sn;
    let studentEmail = this.data.studentsData[0].mail;
    let studentPhone = this.data.studentsData[0].phone;

    let studentName = this.data.studentsData[0].givenname + " " + this.data.studentsData[0].sn;
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    let headerContent = 'ΔΕΛΤΙΟ ΕΙΣΟΔΟΥ ΓΙΑ ΠΡΑΚΤΙΚΗ ΑΣΚΗΣΗ<br>ΠΛΗΡΟΦΟΡΙΑΚΑ ΣΤΟΙΧΕΙΑ ΩΦΕΛΟΥΜΕΝΩΝ ΤΟΥ ΠΡΟΓΡΑΜΜΑΤΟΣ';
    windowPrint?.document.write("<h3 style='text-align: center;'>" + headerContent + "</h3>");
    windowPrint?.document.write("<table>");
    windowPrint?.document.write("<tr><td><strong>Όνομα:</strong> " + studentFirstName + "</td></tr><td><strong>Επώνυμο:</strong> " + studentLastName + "</td></tr>");
    windowPrint?.document.write("<tr><td><strong>Email:</strong> " + studentEmail + "</td></tr><td><strong>Τηλέφωνο:</strong> " + studentPhone + "</td></tr></table>");
    windowPrint?.document.write((printContent?.innerHTML == null) ? '' : printContent?.innerHTML);
    windowPrint?.document.write("<br><br><br><br><br><h3 style='text-align: center;'>Δηλώνω υπεύθυνα ότι τα παραπάνω στοιχεία είναι αληθή</h3>");
    windowPrint?.document.write("<br><h3 style='text-align: right;'>Υπογραφή</h3>");
    windowPrint?.document.write("<h5 style='text-align: right;'>" + currentDate + "</h5><br><br><br>");
    windowPrint?.document.write("<h5 style='text-align: right;'>" + studentName + "</h5>");
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

}
