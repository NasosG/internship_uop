import { Component, HostListener, OnInit } from '@angular/core';
import {AtlasFilters} from '../atlas-filters.model';
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
  filters: AtlasFilters = new AtlasFilters();

  begin: number = 0;
  limit: number = 6; // Number of results to fetch from the backend
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

  public fetchFilteredPositions(filterArray: any) {
    // TODO
    this.studentsService.getAtlasFilteredPositions(this.begin, filterArray)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries.push(...positions);
    });
  }

  public fetchPositionsByDate(positionDates: any) {
    console.log('positionDates ' + positionDates.value);
    this.entries = [];
    positionDates.value === "recent" ? this.filters.publicationDate = 'newest' : this.filters.publicationDate = 'oldest';
    this.fetchFilteredPositions(this.filters);
  }

  public fetchPositionsByCity(cityValue: any) {
    this.entries = [];
    this.filters.location = cityValue.value;
    this.fetchFilteredPositions(this.filters);
  }

  public fetchPositionsByDepartment(depValue: any) {
    console.log('depValue ' + depValue.value);
    this.entries = [];
    this.filters.publicationDate = depValue;
    this.fetchFilteredPositions(this.filters);
  }

  // public fetchNewestPositions() {
  //   this.studentsService.getAtlasNewestPositions(this.begin)
  //     .subscribe((positions: AtlasPosition[]) => {
  //       this.entries.push(...positions);
  //   });
  // }

  // public fetchOldestPositions() {
  //   this.studentsService.getAtlasOldestPositions(this.begin)
  //     .subscribe((positions: AtlasPosition[]) => {
  //       this.entries.push(...positions);
  //   });
  // }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event: any){
    this.scrollFunction();
  }

  public scrollFunction() {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      // const a:any = document.getElementById("pos");
      $('#pos').addClass("fixed-right-desc");
    } else {
      // const a:any = document.getElementById("pos");
       $('#pos').removeClass("fixed-right-desc");
    }
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
    this.jobLastUpdateString = this.getPreferredTimestamp(this.entries[index].positionGroupLastUpdateString);
  }

  public getPreferredTimestamp(dateParam: any) {
    let dateVal = new Date(dateParam);
    let preferredTimestamp = dateVal.getDay() + "/" + dateVal.getMonth()+ "/" + dateVal.getFullYear() + " " + dateVal.getHours() + ":" + dateVal.getMinutes();
    return preferredTimestamp;
  }
}
