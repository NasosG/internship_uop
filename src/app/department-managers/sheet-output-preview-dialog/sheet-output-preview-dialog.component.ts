import { Component, Inject, Input, OnInit } from '@angular/core';
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
  public studentFirstName!: string;
  public studentLastName!: string;
  public studentEmail!: string;
  public studentPhone!: string;
  public studentName!: string;
  public isContractOld: boolean = false;

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
        const creationDate = this.exitForms[0].creation_date ? Utils.getAtlasPreferredTimestamp(this.exitForms[0].creation_date) : this.currentDate;
        this.currentDate = creationDate;

        this.studentFirstName = this.data.studentsData[this.data.index].givenname;
        this.studentLastName = this.data.studentsData[this.data.index].sn;
        this.studentEmail = this.data.studentsData[this.data.index].mail;
        this.studentPhone = this.data.studentsData[this.data.index].phone;
        this.studentName = this.data.studentsData[this.data.index].givenname + " " + this.data.studentsData[this.data.index].sn;

        // To distinguish between the old and new MIS logos, based on student id
        this.departmentManagerService.getStudentContractStatus(this.data.studentsData[this.data.index].uuid).subscribe({
            next: result => {
              console.log('Contract Status:', result);
              this.isContractOld = result;
            },
            error: error => {
              console.error('Error:', error);
              // Handle errors
            }
          });

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
