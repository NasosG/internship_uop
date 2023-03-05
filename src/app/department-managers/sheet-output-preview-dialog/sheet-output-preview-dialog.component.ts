import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { ExitForm } from 'src/app/students/exit-form.model';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';

@Component({
  selector: 'app-sheet-output-preview-dialog',
  templateUrl: './sheet-output-preview-dialog.component.html',
  styleUrls: ['./sheet-output-preview-dialog.component.css']
})
export class SheetOutputPreviewDialogComponent implements OnInit {
  public exitForms: ExitForm[] = [];
  // Global variables
  public unemployedOptionOutputSheet = Utils.unemployedOptionOutputSheet;
  public workingOptionsOutputSheet = Utils.workingOptionsOutputSheet;
  public privateSecOptionsOutputSheet = Utils.privateSecOptionsOutputSheet;
  public publicSecOptionsOutputSheet = Utils.publicSecOptionsOutputSheet;
  public selfEmployedOutputSheet = Utils.selfEmployedOutputSheet;
  public jobRelationOtherThanAboveOutputSheet = Utils.jobRelationOtherThanAboveOutputSheet;
  public specialJobOptionsOutputSheet = Utils.specialJobOptionsOutputSheet;
  public internshipExperienceOutputSheet = Utils.internshipExperienceOutputSheet;
  public educationOptionsOutputSheet = Utils.educationOptionsOutputSheet;

  // Details of the student used in printing the input sheet
  public studentFirstName = this.data.studentsData[0].givenname;
  public studentLastName = this.data.studentsData[0].sn;
  public studentEmail = this.data.studentsData[0].mail;
  public studentPhone = this.data.studentsData[0].phone;
  public studentName = this.data.studentsData[0].givenname + " " + this.data.studentsData[0].sn;
  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public departmentManagerService: DepManagerService,
    public dialogRef: MatDialogRef<SheetOutputPreviewDialogComponent>
  ) { }

  ngOnInit(): void {
    this.departmentManagerService.getStudentExitSheetsByStudentId(this.data.studentsData[this.data.index].uuid)
      .subscribe((forms: ExitForm[]) => {
        this.exitForms = forms;
        console.log(this.exitForms);
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

}
