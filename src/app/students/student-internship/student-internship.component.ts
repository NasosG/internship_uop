import { Component, OnInit } from '@angular/core';
import {AtlasPosition} from '../atlas-position.model';
import {StudentsService} from '../student.service';

@Component({
  selector: 'app-student-internship',
  templateUrl: './student-internship.component.html',
  styleUrls: ['./student-internship.component.css']
})

export class StudentInternshipComponent implements OnInit {
  jobTitle!: string;
  jobDescription!: string;
  jobCity!: string;
  jobCompany!: string;
  providerContactEmail!: string;
  providerContactName!: string;
  providerContactPhone!: string;
  positionType!: string;
  jobDuration!: number;
  jobAvailablePositions!: number;
  jobPhysicalObjects!: string[];
  jobLastUpdateString!: string;

  begin: number = 0;
  entries!: AtlasPosition[];
  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getAtlasPositions(this.begin)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries = positions;
        this.setJobsDetails(0); // TODO: find a way to do it outside of subscribe
    });
    //this.setJobsDetails(0);
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

  displayDescription(index: number) {
    this.setJobsDetails(index);
  }

  setJobsDetails(index: number) {
    this.jobTitle =  this.entries[index].title;
    this.jobDescription = this.entries[index].description;
    this.jobCity = this.entries[index].city;
    this.jobCompany = this.entries[index].name;
    this.positionType = this.entries[index].positionType;
    this.providerContactEmail = this.entries[index].providerContactEmail;
    this.providerContactName = this.entries[index].providerContactName;
    this.providerContactPhone = this.entries[index].providerContactPhone;
    this.jobDuration = this.entries[index].duration;
    this.jobAvailablePositions = this.entries[index].availablePositions;
    this.jobPhysicalObjects = this.entries[index].physicalObjects;
    this.jobLastUpdateString = this.entries[index].positionGroupLastUpdateString;
  }
}
