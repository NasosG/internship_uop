import { Component, OnInit } from '@angular/core';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service.service';

@Component({
  selector: 'app-department-manager-header',
  templateUrl: './department-manager-header.component.html',
  styleUrls: ['./department-manager-header.component.css']
})
export class DepartmentManagerHeaderComponent implements OnInit {
  depManagerData!: DepManager[];

  private reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;

    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);

    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

  constructor(public depManagerService: DepManagerService) { }

  ngOnInit(): void {
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager[]) => {
        this.depManagerData = depManager;
        this.depManagerData[0].schacdateofbirth = this.reformatDateOfBirth(this.depManagerData[0].schacdateofbirth);
        // console.log(this.depManagerData);
      });
  }

}
