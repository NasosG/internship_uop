import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepManagerService } from '../dep-manager.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Contract } from 'src/app/students/contract.model';
import * as moment from 'moment';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-contract-dialog',
  templateUrl: './edit-contract-dialog.component.html',
  styleUrls: ['./edit-contract-dialog.component.css']
})
export class EditContractDialogComponent implements OnInit {
  studentContract!: Contract;
  firstFormGroup: any;
  profileForm = new FormGroup({
    contract_date: new FormControl(''),
    company_name: new FormControl(''),
    company_afm: new FormControl(''),
    company_address: new FormControl(''),
    company_liaison: new FormControl(''),
    company_liaison_position: new FormControl(''),
    displayname: new FormControl(''),
    father_name: new FormControl(''),
    dept_name: new FormControl(''),
    id_number: new FormControl(''),
    amika: new FormControl(''),
    amka: new FormControl(''),
    afm: new FormControl(''),
    doy_name: new FormControl(''),
    pa_subject: new FormControl(''),
    pa_subject_atlas: new FormControl(''),
    pa_start_date: new FormControl(''),
    pa_end_date: new FormControl(''),
    department_manager_name: new FormControl(''),
    ada_number: new FormControl(''),
    student_wages: new FormControl(''),
    apofasi: new FormControl(''),
    arithmos_sunedriashs: new FormControl(''),
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
      company_address: this.profileForm.get('company_address')?.value,
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
      department_manager_name: this.profileForm.get('department_manager_name')?.value,
      ada_number: this.profileForm.get('ada_number')?.value,
      student_wages: this.profileForm.get('student_wages')?.value,
      apofasi: this.profileForm.get('apofasi')?.value,
      arithmos_sunedriashs: this.profileForm.get('arithmos_sunedriashs')?.value
    };

    console.log(generalDetailsData);

    this.depManagerService.onSubmitStudentContractDetails(generalDetailsData,
      this.studentAssignment.student_id, this.studentAssignment.period_id)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        Swal.fire({
          title: 'Αποτυχία',
          text: 'Κάποια πεδία δεν άλλαξαν επιτυχώς'
        });
        return of(null);
      }))
      .subscribe((res: any) => {
        if (res) {
          console.log(res);
          Swal.fire({
            title: 'Επιτυχία',
            text: 'Τα πεδία της σύμβασης άλλαξαν',
            // icon: 'success'
          });
        }
      })
  }
}
