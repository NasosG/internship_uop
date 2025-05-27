import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-buttons',
  templateUrl: './home-buttons.component.html',
  styleUrls: ['./home-buttons.component.css']
})
export class HomeButtonsComponent implements OnInit {
  public maintenance = false;

  constructor() { }

  ngOnInit(): void {
  }
  
  redirectToCAS() {
    window.location.replace('http://praktiki-new.uop.gr:3000/CAS/CASapi.php/');
  }

}
