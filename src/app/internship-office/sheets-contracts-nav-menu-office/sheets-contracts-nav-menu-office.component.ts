import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sheets-contracts-nav-menu-office',
  templateUrl: './sheets-contracts-nav-menu-office.component.html',
  styleUrls: ['./sheets-contracts-nav-menu-office.component.css']
})
export class SheetsContractsNavMenuOfficeComponent implements OnInit {
  @Input() activeLink!: string;

  constructor(public authService: AuthService) { }

  ngOnInit(): void { }

}
