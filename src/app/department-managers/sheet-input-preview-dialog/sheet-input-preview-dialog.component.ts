import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { EntryForm } from 'src/app/students/entry-form.model';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';

@Component({
  selector: 'app-sheet-input-preview-dialog',
  templateUrl: './sheet-input-preview-dialog.component.html',
  styleUrls: ['./sheet-input-preview-dialog.component.css']
})
export class SheetInputPreviewDialogComponent implements OnInit {
  public entryForms: EntryForm[] = [];

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

  unemployedOption = Utils.unemployedOption;
  privateSecOptions = Utils.privateSecOptions;
  publicSecOptions = Utils.publicSecOptions;
  // A4.1 option can be found on the html
  jobRelationOtherThanAbove = Utils.jobRelationOtherThanAbove;
  specialJobOptions = Utils.specialJobOptions;
  educationOptions = Utils.educationOptions;
  educationalStandardOptions = Utils.educationalStandardOptions;
  demographicsOptions = Utils.demographicsOptions;


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

}
