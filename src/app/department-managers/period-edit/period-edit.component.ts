import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { Period } from '../period.model';

@Component({
  selector: 'app-period-edit',
  templateUrl: './period-edit.component.html',
  styleUrls: ['./period-edit.component.css']
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

  constructor(public depManagerService: DepManagerService) { }

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
