import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

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
  selector: 'app-students-position-select-dialog',
  templateUrl: './students-position-select-dialog.component.html',
  styleUrls: ['./students-position-select-dialog.component.css'],
  providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	]
})
export class StudentsPositionSelectDialogComponent implements OnInit {
  selectedRow!: number;
  position: any;
  approvalState?: number | null;
  modelImplementationDateFrom!: string;
  modelImplementationDateTo!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<StudentsPositionSelectDialogComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.depManagerService.getPositionsByApplicationId(this.data.appId).subscribe((positions: any[]) => {
      this.position = positions[this.data.index];
      console.log(this.position);
      this.selectedRow = positions[this.data.index].app_pos_id;
      this.approvalState = this.data.approvalState;

      this.depManagerService.getImplementationDatesByStudentAndPeriod(this.position.student_id, this.position.period_id, this.position.position_id).subscribe((dates: any) => {
        let updatedStartDate = moment(dates[0].pa_start_date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let updatedEndDate = moment(dates[0].pa_end_date, 'YYYY-MM-DD').format('YYYY-MM-DD');

        let implementationDateFromDatePaternB = moment(updatedStartDate, 'YYYY-MM-DD', true);
        let implementationDateToDatePaternB = moment(updatedEndDate, 'YYYY-MM-DD', true);
        // Insert default values if the dates are not valid
        if (!implementationDateFromDatePaternB.isValid() || !implementationDateToDatePaternB.isValid()) {
          this.modelImplementationDateFrom = this.data.implementationDates.implementation_start_date;
          this.modelImplementationDateTo =  this.data.implementationDates.implementation_end_date;
        } else {
          this.modelImplementationDateFrom = updatedStartDate;
          this.modelImplementationDateTo = updatedEndDate;
        }
      });
    });
  }

  onSubmitSwal(assignMode: string) {
    switch (assignMode) {
      case "preassign":
        this.onSubmitPreassignmentSwal();
        break;
      case "assign":
        this.onSubmitAssignmentSwal();
        break;
      default:
        console.error("Invalid assignMode: ", assignMode);
        break;
    }
  }

  onSubmitAssignmentSwal() {
    Swal.fire({
      title: 'Είστε σίγουρος/η για την αποδοχή της θέσης εργασίας;',
      text: 'Η επιλογή είναι οριστική και δεν μπορεί να αναιρεθεί.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, αποδέχομαι',
      cancelButtonText: 'Όχι, ακύρωση'
    }).then((result) => {
      // if user clicks on confirmation button, call acceptPosition() method
      if (result.isConfirmed) {
        this.acceptCompanyPosition();
      }
    });
  }

  updateImplementationDates() {
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

    this.depManagerService.updateImplementationDatesByStudentAndPeriod(this.position.student_id, this.position.period_id, implementationDatesArray, this.position.position_id)
      .subscribe((response: any) => {
        console.log(response);
      });
  }

  acceptCompanyPosition() {
    let implementationDatesArray: any = null;

    if (!this.modelImplementationDateFrom || !this.modelImplementationDateTo) {
      Swal.fire({ icon: 'error', title: 'Σφάλμα', text: 'Παρακαλώ εισάγετε τις ημερομηνίες διεξαγωγής ΠΑ', confirmButtonText: 'Εντάξει' });
      return;
    }

    implementationDatesArray = {
      implementation_start_date: moment(this.modelImplementationDateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      implementation_end_date: moment(this.modelImplementationDateTo, 'YYYY-MM-DD').format('DD/MM/YYYY')
    };

    this.depManagerService.acceptCompanyPosition(this.position.student_id, this.position.position_id, implementationDatesArray)
    .pipe(
      catchError((error: any) => {
        console.error(error);
         Swal.fire({
          title: 'Αποτυχία',
          text: 'Ανεπιτυχής ανάθεση της θέσης με κωδικό group: ' + this.position.position_id,
          icon: 'error'
        });
        return of(null);
      }))
      .subscribe((response: any) => {
        if (response) {
          console.log(response);
          Swal.fire({
            title: 'Επιτυχία',
            text: 'Eπιτυχής ανάθεση της θέσης με κωδικό group: ' + this.position.position_id,
            icon: 'success'
          }).then(() => {
            location.reload();
          });
        }
      });
  }

  onSubmitPreassignmentSwal() {
    Swal.fire({
      title: 'Αποδοχή Φοιτητών',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην επιλογή των φοιτητών;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (!result.isConfirmed) {
        console.log("User pressed Cancel");
        return;
      }

      let positionsDataJson: any[] = [];

      positionsDataJson.push({
        position_id: this.position.position_id,
        internal_position_id: this.position.internal_apps_id,
        title: this.position.title,
        city: this.position.place,
        duration: this.position.duration,
        physical_object: this.position.physical_objects,
        student_id: this.position.student_id,
        department_id: this.position.department_id,
        period_id: this.position.period_id
      });

      console.log(positionsDataJson);
      // alert(`Εισαγωγή θέσης ${this.selectedRow}`);
      this.depManagerService.insertAssignment(positionsDataJson).subscribe((responseData: any) => {
        console.log(responseData.message);
        if (responseData) location.reload();
        //this.ngOnInit();
      }, (error: any) => {
        console.log(error);
        Swal.fire({
          title: 'Αποτυχία',
          text: 'Ανεπιτυχής προδέσμευση της θέσης με κωδικό group: ' + this.position.position_id,
          icon: 'error',
          confirmButtonText: 'ΟΚ'
        });
      });
    });
  }
}
