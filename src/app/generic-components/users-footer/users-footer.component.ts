import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-users-footer',
  templateUrl: './users-footer.component.html',
  styleUrls: ['./users-footer.component.css']
})
export class UsersFooterComponent implements OnInit {
  public currentYear: number = Utils.getCurrentYear();

  constructor() { }

  ngOnInit(): void {}

}
