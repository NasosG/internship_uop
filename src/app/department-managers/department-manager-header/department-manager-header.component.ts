import { Component, OnInit } from '@angular/core';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service.service';
import {Period} from '../period.model';

@Component({
  selector: 'app-department-manager-header',
  templateUrl: './department-manager-header.component.html',
  styleUrls: ['./department-manager-header.component.css']
})
export class DepartmentManagerHeaderComponent implements OnInit {

  public depManagerData!: DepManager;
  public periodData!: Period;
  // private studentSubscription!: Subscription;
  fontSize: number = 100;
  private language!: string;

  phaseArray =["no-state",
  "Σε αναμονή για συμμετοχή των φορέων",
  "Σε αναμονή για συμμετοχή των φοιτητών",
  "Σε αναμονή για ολοκλήρωση αιτήσεων"];

  constructor(public depManagerService: DepManagerService) {
  }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    // this.authService.login('');
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = this.reformatDateOfBirth(this.depManagerData.schacdateofbirth);
        // console.log(this.depManagerData);
      });
    this.depManagerService.getPeriodByUserId()
    .subscribe((periodData: Period) => {
        this.periodData = periodData;
        // console.log(this.depManagerData);
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

