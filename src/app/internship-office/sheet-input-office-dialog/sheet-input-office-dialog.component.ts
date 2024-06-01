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

  // MIS 2021-2027
  public WorkOptionsMIS2127 = Utils.WorkOptionsMIS2127;
  public educationOptionsMIS2127 = Utils.educationOptionsMIS2127;
  public demographicsOptionsMIS2127 = Utils.demographicsOptionsMIS2127;

  // MIS 2014-2020
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
  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');

  // Flag to indicate whether the student's contract is in the old MIS (before 2023) or not
  public isContractOld: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public officeService: OfficeService,
    public dialogRef: MatDialogRef<SheetInputOfficeDialogComponent>
  ) { }

  ngOnInit(): void {
    this.officeService.getStudentEntrySheetsByStudentId(this.data.studentsData[this.data.index].uuid)
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
        this.officeService.getStudentContractStatus(this.data.studentsData[this.data.index].uuid).subscribe({
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
