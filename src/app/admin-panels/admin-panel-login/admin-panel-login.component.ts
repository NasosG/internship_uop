import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel-login',
  templateUrl: './admin-panel-login.component.html',
  styleUrls: ['./admin-panel-login.component.css']
})
export class AdminPanelLoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href = 'http://praktiki-new.uop.gr:3000/CAS/CASapiAdmin.php';
  }

}
