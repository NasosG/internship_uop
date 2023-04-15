import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepManagerService } from '../dep-manager.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentOrder } from 'src/app/students/payment-order.model';
import * as moment from 'moment';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-payment-order-dialog',
  templateUrl: './edit-payment-order-dialog.component.html',
  styleUrls: ['./edit-payment-order-dialog.component.css']
})
export class EditPaymentOrderDialogComponent implements OnInit {
  studentPaymentDetails!: PaymentOrder;
  firstFormGroup: any;
  profileForm = new FormGroup({
    displayname: new FormControl(''),
    father_name: new FormControl(''),
    dept_name: new FormControl(''),
    pa_start_date: new FormControl(''),
    pa_end_date: new FormControl(''),
    department_manager_name: new FormControl(''),
    student_wages: new FormControl('')
  });
  studentAssignment: any;

  // public dateOfBirth: string = Utils.reformatDateOfBirth(this.data.studentsData[this.data.index].schacdateofbirth);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<EditPaymentOrderDialogComponent>, private _formBuilder: FormBuilder
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.studentAssignment = this.data.studentsData[this.data.index];
    this.depManagerService.getContractDetailsByStudentIdAndPeriodId(this.studentAssignment.student_id, this.studentAssignment.period_id)
    .subscribe((contract: PaymentOrder) => {
        this.studentPaymentDetails = contract;
        this.studentPaymentDetails.pa_start_date = moment(this.studentPaymentDetails.pa_start_date).format('YYYY-MM-DD');
        this.studentPaymentDetails.pa_end_date = moment(this.studentPaymentDetails.pa_end_date).format('YYYY-MM-DD');
      });
  }

  /**
   * Used to update student general, contract and contact details,
   * as a controller function
   */
  updateStudentsAllDetails() {
    const generalDetailsData: any = {
      displayname: this.profileForm.get('displayname')?.value,
      father_name: this.profileForm.get('father_name')?.value,
      dept_name: this.profileForm.get('dept_name')?.value,
      pa_start_date: this.profileForm.get('pa_start_date')?.value,
      pa_end_date: this.profileForm.get('pa_end_date')?.value,
      department_manager_name: this.profileForm.get('department_manager_name')?.value,
      student_wages: this.profileForm.get('student_wages')?.value,
    };

    console.log(generalDetailsData);

    this.depManagerService.onSubmitStudentPaymentDetails(generalDetailsData,
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
