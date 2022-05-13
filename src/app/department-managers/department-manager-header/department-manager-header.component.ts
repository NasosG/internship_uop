import { Component, OnInit } from '@angular/core';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service.service';

@Component({
  selector: 'app-department-manager-header',
  templateUrl: './department-manager-header.component.html',
  styleUrls: ['./department-manager-header.component.css']
})
export class DepartmentManagerHeaderComponent implements OnInit {

  public depManagerData!: DepManager;
  // private studentSubscription!: Subscription;
  fontSize: number = 100;
  private language!: string;

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
    // this.studentSubscription = this.studentsService.getStudentUpdateListener()
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

