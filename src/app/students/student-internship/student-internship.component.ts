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
  limit: number = 6; // Number of results to fetch from the back-end
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
    this.filters.publicationDate = depValue.value == "unselected" ? null : depValue;
    this.fetchFilteredPositions(this.filters);
  }

  // public fetchNewestPositions() {
  //   this.studentsService.getAtlasNewestPositions(this.begin)
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



  // selectAll(selectAllCheckbox: any) {
  //   console.log(selectAllCheckbox);
  //     let checkboxes: any = document.getElementsByName('check-boxes');
  //     for (let checkbox of checkboxes) {
  //         checkbox.checked = selectAllCheckbox.checked;
  //     }
  // }
  //   selectOneOption(id: string) {
//   	  let selectAllCheckbox: any = document.getElementById('select-all');
//       let checkboxes: any = document.getElementsByName('check-boxes');
//       let myself: any = document.getElementById(id);

//       for (let checkbox of checkboxes) {
//         //  selectAllCheckbox.checked = false;
//          checkbox.checked = false;
//       }

//      // myself.checked = true;
//   }
    selectAll() {
  	  let selectAllCheckbox: any = document.getElementById('select-all');
      // let checkboxes: any = document.getElementsByName('check-boxes');
      let check2: any = document.getElementById('check-2');
      let check3: any = document.getElementById('check-3');
      console.log(selectAllCheckbox);
      check2.checked = selectAllCheckbox.checked;
      check3.checked = selectAllCheckbox.checked;

      this.entries = [];
      this.filters.workingHours = "";
      this.fetchFilteredPositions(this.filters);
  }

    selectOneOption(id: string) {
  	  let selectAllCheckbox: any = document.getElementById('select-all');
      // let checkboxes: any = document.getElementsByName('check-boxes');
      let check: any = document.getElementById(id);
      let check2: any = document.getElementById('check-2');
      let check3: any = document.getElementById('check-3');

      if (check.id == 'check-2') {
        check2.checked = true;
        check3.checked = false;
      } else {
        check3.checked = true;
        check2.checked = false;
      }

      selectAllCheckbox.checked = false;

      this.entries = [];
      this.filters.workingHours = check.value == "unselected" ? "" : check.value;
      this.fetchFilteredPositions(this.filters);
  }
}
