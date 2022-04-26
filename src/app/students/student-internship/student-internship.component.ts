import { Component, HostListener, OnInit } from '@angular/core';
import {AtlasFilters} from '../atlas-filters.model';
import {AtlasPosition} from '../atlas-position.model';
import {City} from '../city.model';
import {Department} from '../department.model';
import {Prefecture} from '../prefecture.model';
import {StudentsService} from '../student.service';

@Component({
  selector: 'app-student-internship',
  templateUrl: './student-internship.component.html',
  styleUrls: ['./student-internship.component.css']
})

export class StudentInternshipComponent implements OnInit {
  jobPositionId!: number;
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
  limit: number = 6; // Number of results to fetch from the back-end
  entries!: AtlasPosition[];
  departments!: Department[];
  cities!: City[];

  timer!: any;      // Timer identifier
  waitTime: number = 500;   // Wait time in milliseconds

  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getAtlasInstitutions()
      .subscribe((fetchedDepartments: Department[]) => {
        this.departments = fetchedDepartments;
    });
    this.studentsService.getAtlasCities()
      .subscribe((fetchedCities: City[]) => {
        this.cities = fetchedCities;
    });
    this.studentsService.getAtlasPositions(this.begin)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries = positions;
        this.setJobsDetails(0); // TODO: find a way to do it outside of subscribe
    });
    //this.setJobsDetails(0);
  }

  fetchMorePositions(beginParam: number) {
    this.begin += this.limit;
    const isFilterArrayEmpty = Object.values(this.filters).every(x => x === null || x === '');
    if (!isFilterArrayEmpty) {
      this.fetchMoreFilteredPositions(this.filters, beginParam);
      return;
    }
    this.studentsService.getAtlasPositions(beginParam)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries.push(...positions);
    });
  }

  public fetchFilteredPositions(filterArray: any) {
    // begin value needs to be refreshed (assigned to 0)
    this.begin = 0;
    this.studentsService.getAtlasFilteredPositions(this.begin, filterArray)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries.push(...positions);
    });
  }

  public fetchMoreFilteredPositions(filterArray: any, beginParam: number) {
    this.studentsService.getAtlasFilteredPositions(beginParam, filterArray)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries.push(...positions);
    });
  }

  public fetchPositionsByDate(positionDates: any) {
    this.entries = [];
    if (positionDates.value == "unselected") {
      this.filters.publicationDate = "";
    }
    else {
      positionDates.value === "recent" ? this.filters.publicationDate = 'newest' : this.filters.publicationDate = 'oldest';
    }
    this.fetchFilteredPositions(this.filters);
  }

  public fetchPositionsByCity(cityValue: any) {
    this.entries = [];
    this.filters.location = cityValue.value == "unselected" ? null : cityValue.value;
    this.fetchFilteredPositions(this.filters);
  }

  public fetchPositionsByMonths(months: any) {
    this.entries = [];
    this.filters.monthsOfInternship = months.value == "unselected" ? null : months.value;
    this.fetchFilteredPositions(this.filters);
  }

  public fetchPositionsByDepartment(depValue: any) {
    this.entries = [];
    this.filters.institution = depValue.value == "unselected" ? null : depValue.value;
    this.fetchFilteredPositions(this.filters);
  }

  public fetchPositionsByWorkingHours(currentCheckbox: any) {
    this.entries = [];
    this.filters.workingHours = currentCheckbox.value == "unselected" ? "" : currentCheckbox.value;
    this.fetchFilteredPositions(this.filters);
  }

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
    this.jobPositionId = this.entries[index].atlasPositionId;
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

  public selectAll() {
      let selectAllCheckbox: any = document.getElementById('select-all');
      let checkboxes: any = document.getElementsByName('check-boxes');
      for (let checkbox of checkboxes) {
          checkbox.checked = selectAllCheckbox.checked;
      }
      this.fetchPositionsByWorkingHours(selectAllCheckbox);
  }

  public selectOneOption(id: string) {
    let selectAllCheckbox: any = document.getElementById('select-all');
    let checkboxes: any = document.getElementsByName('check-boxes');
    let currentCheckbox: any = document.getElementById(id);

    for (let checkbox of checkboxes) {
      selectAllCheckbox.checked = checkbox.checked = false;
    }

    currentCheckbox.checked = true;
    this.fetchPositionsByWorkingHours(currentCheckbox);
  }

  // selectAll() {
  // 	   let selectAllCheckbox: any = document.getElementById('select-all');
  //     let check2: any = document.getElementById('check-2');
  //     let check3: any = document.getElementById('check-3');
  //     check2.checked = check3.checked = selectAllCheckbox.checked;
  //     this.fetchPositionsByWorkingHours(selectAllCheckbox);
  // }

  // selectOneOption(id: string) {
  //   let selectAllCheckbox: any = document.getElementById('select-all');
  //   let check: any = document.getElementById(id);
  //   let check2: any = document.getElementById('check-2');
  //   let check3: any = document.getElementById('check-3');

  //   if (check.id == 'check-2') {
  //     check2.checked = true;
  //     check3.checked = false;
  //   } else {
  //     check3.checked = true;
  //     check2.checked = false;
  //   }

  //   selectAllCheckbox.checked = false;
  //   this.fetchPositionsByWorkingHours(check);
  // }

  // Search for providers function
  search(text: any) {
    this.entries = [];
    this.filters.provider = !text ? null : text;
    // Make HTTP Request HERE
    this.fetchFilteredPositions(this.filters);
  }


  searchFor(provider: any) {
     // Clear timer
     clearTimeout(this.timer);

     // Wait for X ms and then process the request
     this.timer = setTimeout(() => {
        this.search(provider.value);
     }, this.waitTime);
  }

  addPosition(positionId: number) {
    this.studentsService.insertStudentPosition(positionId);
  }
}
