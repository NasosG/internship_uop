import { AfterViewInit, Component, OnInit } from '@angular/core';

declare const $:any;

@Component({
  selector: 'app-student-match',
  templateUrl: './student-match.component.html',
  styleUrls: ['./student-match.component.css']
})
export class StudentMatchComponent implements OnInit, AfterViewInit {

  constructor() { }

  dtOptions: any = {};

  ngOnInit() {
    // do nothing
  }

  randomNumber() {
    return Math.floor(Math.random() * 1000000);
  }

  ngAfterViewInit(): void {
    $('#example').DataTable();
  }

}
