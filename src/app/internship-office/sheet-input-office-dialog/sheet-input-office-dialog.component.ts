import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { EntryForm } from 'src/app/students/entry-form.model';
import Swal from 'sweetalert2';
import { OfficeService } from '../office.service';

@Component({
  selector: 'app-sheet-input-office-dialog',
  templateUrl: './sheet-input-office-dialog.component.html',
  styleUrls: ['./sheet-input-office-dialog.component.css']
})
export class SheetInputOfficeDialogComponent implements OnInit {
  public entryForms: EntryForm[] = [];
  // Global variables
  public workBeforeInternship = Utils.workBeforeInternship;
  public unemployedOption = Utils.unemployedOption;
  public privateSecOptions = Utils.privateSecOptions;
  public publicSecOptions = Utils.publicSecOptions;
  // A4.1 option can be found on the html
  public jobRelationOtherThanAbove = Utils.jobRelationOtherThanAbove;
  public specialJobOptions = Utils.specialJobOptions;
  public educationOptions = Utils.educationOptions;
  public educationalStandardOptions = Utils.educationalStandardOptions;
  public demographicsOptions = Utils.demographicsOptions;

  // Details of the student used in printing the input sheet
  public studentFirstName = this.data.studentsData[0].givenname;
  public studentLastName = this.data.studentsData[0].sn;
  public studentEmail = this.data.studentsData[0].mail;
  public studentPhone = this.data.studentsData[0].phone;
  public studentName = this.data.studentsData[0].givenname + " " + this.data.studentsData[0].sn;
  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public officeService: OfficeService,
    public dialogRef: MatDialogRef<SheetInputOfficeDialogComponent>
  ) { }

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

  getArrayValueByOptionId(option_id: string): boolean {
    const arrayKey = option_id as keyof EntryForm;
    const value: any = this.entryForms[0][arrayKey];
    if (value === '' || value === 0 || value === undefined || value === null) {
      return false;
    }

    return value;
  }

}
