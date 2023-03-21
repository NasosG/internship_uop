import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sheets',
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.css']
})
export class SheetsComponent implements OnInit {
  areSheetsDisabled = true;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
