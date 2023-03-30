import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {StudentsService} from '../student.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.css']
})
export class SheetsComponent implements OnInit {
  public areSheetsDisabled: boolean = true;

  constructor(public authService: AuthService, private studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.isSheetEnabledForStudent().subscribe((enabledResult: boolean) => {
        this.areSheetsDisabled = !enabledResult;
    });
  }

}
