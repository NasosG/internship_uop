import { Component, OnInit } from '@angular/core';
import {DepManager} from '../dep-manager.model';
import {DepManagerService} from '../dep-manager.service.service';
import {Period} from '../period.model';

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
  phaseArray =["no-state",
  "Σε αναμονή για συμμετοχή των φορέων",
  "Σε αναμονή για συμμετοχή των φοιτητών",
  "Σε αναμονή για ολοκλήρωση αιτήσεων"];

  constructor(public depManagerService: DepManagerService) {}

  ngOnInit() {
    // this.authService.login('');
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = this.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
      });
    this.depManagerService.getPeriodByUserId()
      .subscribe((periodData: Period) => {
        this.periodData = periodData;
      });
  }


  private reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;

    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);

    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

}
