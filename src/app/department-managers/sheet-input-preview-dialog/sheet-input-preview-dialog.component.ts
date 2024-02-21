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
  public studentFirstName!: string;
  public studentLastName!: string;
  public studentEmail!: string;
  public studentPhone!: string;
  public studentName!: string;

  // Flag to indicate whether the student's contract is in the old MIS (before 2023) or not
  public isContractOld: boolean = false;

  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');

  constructor(
    public dialogRef: MatDialogRef<SheetInputPreviewDialogComponent>,
    public dialog: MatDialog,
    public departmentManagerService: DepManagerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.departmentManagerService.getStudentEntrySheetsByStudentId(this.data.studentsData[this.data.index].uuid)
      .subscribe((forms: EntryForm[]) => {
        this.entryForms = forms;
        console.log(this.entryForms);
        const creationDate = this.entryForms[0].creation_date ? Utils.getAtlasPreferredTimestamp(this.entryForms[0].creation_date) : this.currentDate;
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

  getArrayValueByOptionId(option_id: string): boolean {
    const arrayKey = option_id as keyof EntryForm;
    const value: any = this.entryForms[0][arrayKey];
    if (value === '' || value === 0 || value === undefined || value === null) {
      return false;
    }

    return value;
  }

}
