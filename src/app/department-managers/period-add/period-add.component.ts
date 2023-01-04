import { Component, Input, Injectable, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {DepManager} from '../dep-manager.model';
import {Utils} from 'src/app/MiscUtils';
import {Period} from '../period.model';

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
  selector: 'app-period-add',
  templateUrl: './period-add.component.html',
  styleUrls: ['./period-add.component.css'],
  providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	]
})

export class PeriodAddComponent implements OnInit {
  public depManagerData!: DepManager;
  ngSelect = "";
  ngSelectPhase = "1";
  public isShown: boolean = false ; // hidden by default
  @Input() item = 0; // decorate the property with @Input()
  availablePositions!: number;
  public periodData!: Period;
  espaPositions!: number;

  toggleShow() {
    this.isShown = !this.isShown;
    let element:any;
    element = document.getElementById("toggleVisibilityAddPeriod");
    element.css("visibility", this.isShown ? "hidden" : "visible");
  }

  constructor(public depManagerService: DepManagerService, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }

  ngOnInit(): void {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        //this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
console.log(this.depManagerData);
        this.depManagerService.getPeriodByDepartmentId(this.depManagerData.department_id)
          .subscribe((periodData: Period) => {
            this.periodData = periodData;
            console.log(this.periodData);
             this.espaPositions = this.periodData.positions ? this.periodData.positions: 99;
            this.availablePositions = 0; // In the beginning there are no available positions
          });
      });
  }

  validateInputNumber(field: any) {
    if (field.value.length > field.maxLength) {
      field.value = field.value.slice(0, field.maxLength);
    }
    field.value = Math.abs(field.value);
  }

  onSubmitPeriodForm(formData: FormData) {
    this.validateFormData(formData);
    this.depManagerService.insertPeriod(formData, this.depManagerService.manager.department_id);
    this.onSavePeriodAlert();
  }

  private validateFormData(formData: FormData) {
    for (const field of Object.values(formData)) {
      if (!field) {
        this.onFieldEmptyAlert();
        break;
      }
    }
  }

  private onSavePeriodAlert() {
    Swal.fire({
      title: 'Δημιουργία Περιόδου',
      text: 'Επιτυχής δημιουργία περιόδου',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then(() => { location.reload(); });
  }

  private onFieldEmptyAlert() {
    Swal.fire({
      title: 'Έλλειψη τιμής σε πεδίο',
      text: 'Κάποιο πεδίο ήταν κενό',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

}

