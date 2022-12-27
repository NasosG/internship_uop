import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { EntryForm } from 'src/app/students/entry-form.model';
import Swal from 'sweetalert2';
import { OfficeService } from '../office.service';

@Component({
  selector: 'app-sheet-input-office-edit-dialog',
  templateUrl: './sheet-input-office-edit-dialog.component.html',
  styleUrls: ['./sheet-input-office-edit-dialog.component.css']
})
export class SheetInputOfficeEditDialogComponent implements OnInit {
  public yesNoOptions = [true, false];
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
    public officeService: OfficeService,
    public dialogRef: MatDialogRef<SheetInputOfficeEditDialogComponent>
  ) { }

  turnBooleanToYesNo(value: boolean): string {
    return value ? 'ΝΑΙ' : 'ΟΧΙ';
  }

  ngOnInit(): void {
    this.officeService.getStudentEntrySheetsByStudentId(this.data.studentsData[this.data.index].uuid)
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

  submitFieldValue(fieldId : string, elementValue : boolean) {
    // We get 2 ids from join becasuse 2 tables have id field, this one is the id of the entry sheet
    let formId = this.data.studentsData[0].id;
    // use a service function to send element and fieldId to the backend
    this.officeService.updateEntrySheetField(formId, fieldId, elementValue)
      .subscribe(
         res => console.log('HTTP response', res),
         err => alert('Error while updating entry sheet field') ,
         () => console.log('HTTP request completed.')
      );
  }

}
