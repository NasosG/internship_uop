import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { Period } from '../period.model';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Student } from 'src/app/students/student.model';

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
  selector: 'app-period-edit',
  templateUrl: './period-edit.component.html',
  styleUrls: ['./period-edit.component.css'],
  providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	]
})
export class PeriodEditComponent implements OnInit {
  public depManagerData!: DepManager;
  public periodData!: Period;
  public ngSelect: String = "";
  public ngSelectPhase: String = "";
  @ViewChild('selectPhase') selectPhase!: any;
  phaseBe4Update!: number;
  dateToBe4Update!: Date;
  initialPeriodData!: Period;
  @ViewChild('datepicker4') selectDateTo!: any;
  studentWithPhaseZero: Student|undefined;
  public adminUser = 'a.user';

  constructor(public depManagerService: DepManagerService, private location: Location, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }

  ngOnInit() {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);

        this.depManagerService.getPeriodByDepartmentId(this.depManagerData.department_id)
          .subscribe((periodData: Period) => {
             this.periodData = periodData;
             this.phaseBe4Update = this.periodData.phase_state;
             this.dateToBe4Update = this.periodData?.date_to;
             this.initialPeriodData = this.periodData;

             this.depManagerService.getStudentsApplyPhase()
              .subscribe((students: Student[]) => {
                this.studentWithPhaseZero = students.find(student => student.phase !== -1 && student.phase !== 2 && student.phase !== 3);
              });
            });
      });
  }

  validateInputNumber(field: any) {
    if (field.value.length > field.maxLength) {
      field.value = field.value.slice(0, field.maxLength);
    }
    field.value = Math.abs(field.value);
  }

  onSubmitPeriodEditForm(formData: FormData) {
    console.log(this.phaseBe4Update);
    console.log(this.periodHasNotEnded());
    if (this.phaseBe4Update < parseInt(this.selectPhase.nativeElement.value)) {
      if (this.phaseBe4Update == 1 && this.periodHasNotEnded()) {
        Swal.fire({
          title: 'Επεξεργασία Περιόδου',
          text: 'Δεν μπορείτε να αλλάξετε την φάση της περιόδου, εφόσον η προηγούμενη φάση δεν έχει λήξει',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        });

        // this.selectPhase.nativeElement.value = 1;
        // this.periodData.phase_state = 1;
        return;
      }

      let allStudentsApplicationsDone = this.studentWithPhaseZero !== undefined;
      if (allStudentsApplicationsDone) {
        Swal.fire({
          title: 'Έλεγχος αποτελεσμάτων',
          text: 'Η κατάσταση κάποιων αιτήσεων είναι "Προς Επιλογή". Παρακαλούμε επεξεργαστείτε όλες τις αιτήσεις πριν βγάλετε αποτελέσματα'
        });
        return;
      }
    }
    this.depManagerService.updatePeriodById(formData, this.periodData.id);
    this.onSavePeriodAlert();
  }

  periodHasNotEnded():boolean {
    return moment(new Date()).isSameOrBefore(this.dateToBe4Update, 'day');
  }

  insertPhase2StudentsRank() {
    if (parseInt(this.selectPhase.nativeElement.value) == 1) {
      return;
    }
    if (this.phaseBe4Update < parseInt(this.selectPhase.nativeElement.value)) {
      if (this.phaseBe4Update == 1 && this.periodHasNotEnded()) {
        return;
      }
    }
    let allStudentsApplicationsDone = this.studentWithPhaseZero !== undefined;
    if (allStudentsApplicationsDone) {
      return;
    }

    this.depManagerService.insertApprovedStudentsRank(this.depManagerData.department_id, this.periodData.phase_state, this.periodData.id)
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  back(): void {
    this.location.back();
  }

  private onSavePeriodAlert() {
    Swal.fire({
      title: 'Επεξεργασία Περιόδου',
      text: 'Τα στοιχεία της περιόδου άλλαξαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then(() => { location.reload(); });
  }
}
