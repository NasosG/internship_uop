import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sheets-contracts-nav-menu',
  templateUrl: './sheets-contracts-nav-menu.component.html',
  styleUrls: ['./sheets-contracts-nav-menu.component.css']
})
export class SheetsContractsNavMenuComponent implements OnInit {
  @Input() activeLink!: string;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
