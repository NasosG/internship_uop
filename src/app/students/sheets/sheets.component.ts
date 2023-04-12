import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {StudentsService} from '../student.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.css']
})
export class SheetsComponent implements OnInit {
  public areEntrySheetsDisabled: boolean = true;
  public areExitSheetsDisabled: boolean = true;

  constructor(public authService: AuthService, private studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.isEntrySheetEnabledForStudent().subscribe((enabledResult: boolean) => {
        this.areEntrySheetsDisabled = !enabledResult;
    });
    this.studentsService.isExitSheetEnabledForStudent().subscribe((enabledResult: boolean) => {
        this.areExitSheetsDisabled = !enabledResult;
    });
  }

}
