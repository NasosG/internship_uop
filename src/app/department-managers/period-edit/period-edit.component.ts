import { Component, Injectable, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { Period } from '../period.model';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  phaseArray = ["no-state",
    "Σε αναμονή για συμμετοχή των φορέων",
    "Σε αναμονή για συμμετοχή των φοιτητών",
    "Σε αναμονή για ολοκλήρωση αιτήσεων"];

  constructor(public depManagerService: DepManagerService, private location: Location, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }

  ngOnInit() {
    // this.authService.login('');
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
      });
    this.depManagerService.getPeriodByUserId()
      .subscribe((periodData: Period) => {
        this.periodData = periodData;
      });
  }

  onSubmitPeriodEditForm(formData: FormData) {
    this.depManagerService.updatePeriodById(formData, this.periodData.id);
    this.onSavePeriodAlert();
  }

  insertPhase2StudentsRank() {
    this.depManagerService.insertApprovedStudentsRank(this.depManagerData.department_id, this.periodData.phase_state);
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
