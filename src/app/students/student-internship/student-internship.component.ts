import { Component, OnInit } from '@angular/core';
import {AtlasPosition} from '../atlas-position.model';
import {StudentsService} from '../student.service';

@Component({
  selector: 'app-student-internship',
  templateUrl: './student-internship.component.html',
  styleUrls: ['./student-internship.component.css']
})
export class StudentInternshipComponent implements OnInit {
  begin: number = 0;
  entries!: AtlasPosition[];
  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getAtlasPositions(this.begin)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries = positions;
        // console.log("result: " +  this.entries[0].city);
        // console.log("result: " +  this.entries[2].city);
    });
  }

  fetchMorePositions(beginParam: number) {
    this.begin += 8;
    this.studentsService.getAtlasPositions(beginParam)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries.push(...positions);
        // console.log("result: " +  this.entries[12].city);
        // console.log("result: " +  this.entries[14].city);
    });
  }

}
