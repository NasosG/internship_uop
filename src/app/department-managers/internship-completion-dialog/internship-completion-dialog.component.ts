import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Utils } from 'src/app/MiscUtils';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[2], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[0], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
	}
}
@Component({
  selector: 'app-internship-completion-dialog',
  templateUrl: './internship-completion-dialog.component.html',
  styleUrls: ['./internship-completion-dialog.component.css'],
  providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	]
})
export class InternshipCompletionDialogComponent implements OnInit {
  position: any;
  public modelImplementationDateFrom!: string;
  public modelImplementationDateTo!: string;
  public completionComments: string = '';
  public isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<InternshipCompletionDialogComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close(Utils.CustomDialogAction.CANCEL);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.depManagerService.getAssignedPositionById(this.data.assigned_position_id)
      .pipe(
        catchError((error: any) => {
          Swal.fire({
            title: 'Σφάλμα',
            text: 'Σφάλμα κατά την άντληση των ημερομηνιών εκτέλεσης ΠΑ από ΑΤΛΑ',
            icon: 'error',
            confirmButtonText: 'Εντάξει'
          });
          this.isLoading = false;
          throw error;
        })
      )
      .subscribe((res: any) => {
        console.log(res);
        // Needed performance, so I removed the validations, because I was confident that dates are DD/MM/YYYY
        let updatedStartDate = moment(res.ImplementationStartDateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
        let updatedEndDate = moment(res.ImplementationEndDateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
        this.modelImplementationDateFrom = updatedStartDate;
        this.modelImplementationDateTo = updatedEndDate;
        this.isLoading = false;
    })
  }

  submitPositionCompletion() {
    // if this.modelImplementationDateFrom is valid date of format YYYY-MM-DD or YYYY-M-D
    let implementationDateFromDatePaternA = moment(this.modelImplementationDateFrom, 'YYYY-M-D', true);
    let implementationDateFromDatePaternB = moment(this.modelImplementationDateFrom, 'YYYY-MM-DD', true);
    let implementationDateToDatePaternA = moment(this.modelImplementationDateTo, 'YYYY-M-D', true);
    let implementationDateToDatePaternB = moment(this.modelImplementationDateTo, 'YYYY-MM-DD', true);

    if (!implementationDateFromDatePaternA.isValid() && !implementationDateFromDatePaternB.isValid()) {
      console.log("invalid 'FROM' date");
      return;
    }
    if (!implementationDateToDatePaternA.isValid() && !implementationDateToDatePaternB.isValid()) {
      console.log("invalid 'TO' date");
      return;
    }

    let implementationDatesArray = {
      implementation_start_date: moment(this.modelImplementationDateFrom, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      implementation_end_date: moment(this.modelImplementationDateTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
    };

    // this.depManagerService.updateImplementationDatesByStudentAndPeriod(this.position.student_id, this.position.period_id, implementationDatesArray, this.position.position_id)
    //   .subscribe((response: any) => {
    //     console.log(response);
    //   });

    this.depManagerService.completeAtlasPosition(this.data.assigned_position_id, implementationDatesArray, this.completionComments)
      .pipe(
        catchError((error: any) => {
          console.error(error);
          Swal.fire({
            title: 'Σφάλμα',
            text: 'Προέκυψε κάποιο σφάλμα κατά την ολοκλήρωση της ΠΑ στο ΑΤΛΑΣ.',
            icon: 'error',
            confirmButtonText: 'Εντάξει'
          });
          throw error;
        })
      )
      .subscribe((response: any) => {
        console.log(response);
        if (!response) return;
        Swal.fire({
          title: 'Επιτυχής ολοκλήρωση',
          text: 'Η ΠΑ ολοκληρώθηκε με επιτυχία',
          icon: 'success',
          confirmButtonText: 'Εντάξει'
        });

        this.depManagerService.updateAssignmentStateByStudentAndPosition(this.data.studentId, this.data.assigned_position_id, this.data.periodId)
          .subscribe((data: any ) => {
            console.log(`updateAssignmentState good - data: ${data}`);
            this.dialogRef.close(Utils.CustomDialogAction.OK);
          });
      });
  }

}
