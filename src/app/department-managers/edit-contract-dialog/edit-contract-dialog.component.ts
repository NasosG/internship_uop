import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepManagerService } from '../dep-manager.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Contract } from 'src/app/students/contract.model';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-contract-dialog',
  templateUrl: './edit-contract-dialog.component.html',
  styleUrls: ['./edit-contract-dialog.component.css']
})
export class EditContractDialogComponent implements OnInit {
  studentContract!: Contract;
  firstFormGroup: any;
  profileForm = new FormGroup({
    contract_date: new FormControl('', [Validators.required]),
    company_name: new FormControl('', [Validators.required]),
    company_afm: new FormControl('', [Validators.required]),
    comopany_address: new FormControl('', [Validators.required]),
    company_liaison: new FormControl('', [Validators.required]),
    company_liaison_position: new FormControl('', [Validators.required]),
    displayname: new FormControl('', [Validators.required]),
    father_name: new FormControl('', [Validators.required]),
    dept_name: new FormControl('', [Validators.required]),
    id_number: new FormControl('', [Validators.required]),
    amika: new FormControl('', [Validators.required]),
    amka: new FormControl('', [Validators.required]),
    afm: new FormControl('', [Validators.required]),
    doy_name: new FormControl('', [Validators.required]),
    pa_subject: new FormControl('', [Validators.required]),
    pa_subject_atlas: new FormControl('', [Validators.required]),
    pa_start_date: new FormControl('', [Validators.required]),
    pa_end_date: new FormControl('', [Validators.required]),
    department_manager_name: new FormControl('', [Validators.required])
  });
  studentAssignment: any;

  // public dateOfBirth: string = Utils.reformatDateOfBirth(this.data.studentsData[this.data.index].schacdateofbirth);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<EditContractDialogComponent>, private _formBuilder: FormBuilder
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.studentAssignment = this.data.studentsData[this.data.index];
    this.depManagerService.getContractDetailsByStudentIdAndPeriodId(this.studentAssignment.student_id, this.studentAssignment.period_id)
    .subscribe((contract: Contract) => {
        this.studentContract = contract;
        this.studentContract.contract_date = moment(this.studentContract.contract_date).format('YYYY-MM-DD');
        this.studentContract.pa_start_date = moment(this.studentContract.pa_start_date).format('YYYY-MM-DD');
        this.studentContract.pa_end_date = moment(this.studentContract.pa_end_date).format('YYYY-MM-DD');
      });
  }

  /**
   * Used to update student general, contract and contact details,
   * as a controller function
   */
  updateStudentsAllDetails() {
    const generalDetailsData: any = {
      contract_date: this.profileForm.get('contract_date')?.value,
      company_name: this.profileForm.get('company_name')?.value,
      company_afm: this.profileForm.get('company_afm')?.value,
      comopany_address: this.profileForm.get('comopany_address')?.value,
      company_liaison: this.profileForm.get('company_liaison')?.value,
      company_liaison_position: this.profileForm.get('company_liaison_position')?.value,
      displayname: this.profileForm.get('displayname')?.value,
      father_name: this.profileForm.get('father_name')?.value,
      dept_name: this.profileForm.get('dept_name')?.value,
      id_number: this.profileForm.get('id_number')?.value,
      amika: this.profileForm.get('amika')?.value,
      amka: this.profileForm.get('amka')?.value,
      afm: this.profileForm.get('afm')?.value,
      doy_name: this.profileForm.get('doy_name')?.value,
      pa_subject: this.profileForm.get('pa_subject')?.value,
      pa_subject_atlas: this.profileForm.get('pa_subject_atlas')?.value,
      pa_start_date: this.profileForm.get('pa_start_date')?.value,
      pa_end_date: this.profileForm.get('pa_end_date')?.value,
      department_manager_name: this.profileForm.get('department_manager_name')?.value
    };

    this.depManagerService.onSubmitStudentContractDetails(generalDetailsData, this.studentAssignment.student_id, this.studentAssignment.period_id);
  }
}
