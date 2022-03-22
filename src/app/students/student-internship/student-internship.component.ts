import { Component, OnInit } from '@angular/core';
import {AtlasPosition} from '../atlas-position.model';
import {StudentsService} from '../student.service';

@Component({
  selector: 'app-student-internship',
  templateUrl: './student-internship.component.html',
  styleUrls: ['./student-internship.component.css']
})
export class StudentInternshipComponent implements OnInit {
  entries!: AtlasPosition;
  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getAtlasPositions()
      .subscribe((positions: AtlasPosition) => {
        this.entries = positions;
        alert("result: " +  positions.City);
    });
  }

}
