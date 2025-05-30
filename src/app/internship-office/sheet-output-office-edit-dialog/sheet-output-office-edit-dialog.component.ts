import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { ExitForm } from 'src/app/students/exit-form.model';
import Swal from 'sweetalert2';
import { OfficeService } from '../office.service';

@Component({
  selector: 'app-sheet-output-office-edit-dialog',
  templateUrl: './sheet-output-office-edit-dialog.component.html',
  styleUrls: ['./sheet-output-office-edit-dialog.component.css']
})
export class SheetOutputOfficeEditDialogComponent implements OnInit {
  public yesNoOptions = [true, false];
  public exitForms: ExitForm[] = [];
  
  // Global variables
  
  // MIS 2021-2027
  public workOptionsOutputSheetMIS2127 = Utils.workOptionsOutputSheetMIS2127;
  public educationOptionsOutputSheetMIS2127 = Utils.educationOptionsOutputSheetMIS2127;
  public internshipExperienceOutputSheetMIS2127 = Utils.internshipExperienceOutputSheetMIS2127;
  // Old MISS
  public unemployedOptionOutputSheet = Utils.unemployedOptionOutputSheet;
  public workingOptionsOutputSheet = Utils.workingOptionsOutputSheet;
  public privateSecOptionsOutputSheet = Utils.privateSecOptionsOutputSheet;
  public publicSecOptionsOutputSheet = Utils.publicSecOptionsOutputSheet;
  public selfEmployedOutputSheet = Utils.selfEmployedOutputSheet;
  public jobRelationOtherThanAboveOutputSheet = Utils.jobRelationOtherThanAboveOutputSheet;
  public specialJobOptionsOutputSheet = Utils.specialJobOptionsOutputSheet;
  public internshipExperienceOutputSheet = Utils.internshipExperienceOutputSheet;
  public educationOptionsOutputSheet = Utils.educationOptionsOutputSheet;

  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public officeService: OfficeService,
    public dialogRef: MatDialogRef<SheetOutputOfficeEditDialogComponent>
  ) { }

  ngOnInit(): void {
    this.officeService.getStudentExitSheetsByStudentId(this.data.studentsData[this.data.index].uuid)
      .subscribe((forms: ExitForm[]) => {
        this.exitForms = forms;
        console.log(this.exitForms);
      });
  }

  public isMisNew(): boolean {
    const creationDate = this.exitForms[0].creation_date ? Utils.getAtlasPreferredTimestamp(this.exitForms[0].creation_date) : this.currentDate;
    return (creationDate >= '01/01/2024' || creationDate  >= '2024-01-01');
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

  printOutputSheet() {
    let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
    const printContent = document.getElementById("exitSheetPreviewContent");
    let studentFirstName = this.data.studentsData[0].givenname;
    let studentLastName = this.data.studentsData[0].sn;
    let studentEmail = this.data.studentsData[0].mail;
    let studentPhone = this.data.studentsData[0].phone;

    let studentName = this.data.studentsData[0].givenname + " " + this.data.studentsData[0].sn;
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    let headerContent = 'ΔΕΛΤΙΟ ΕΞΟΔΟΥ ΠΡΑΚΤΙΚΗΣ ΑΣΚΗΣΗΣ<br>ΠΛΗΡΟΦΟΡΙΑΚΑ ΣΤΟΙΧΕΙΑ ΩΦΕΛΟΥΜΕΝΩΝ ΤΟΥ ΠΡΟΓΡΑΜΜΑΤΟΣ';
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

  submitFieldValue(fieldId : string, elementValue : boolean) {
    let formId = this.data.studentsData[this.data.index].exit_id;
    // use a service function to send element and fieldId to the backend
    this.officeService.updateExitSheetField(formId, fieldId, elementValue)
      .subscribe(
         res => console.log('HTTP response', res),
         err => alert('Error while updating entry sheet field') ,
         () => console.log('HTTP request completed.')
      );
  }
}
