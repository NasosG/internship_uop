import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { AtlasFilters } from 'src/app/students/atlas-filters.model';
import { AtlasPosition } from 'src/app/students/atlas-position.model';
import { City } from 'src/app/students/city.model';
import { Department } from 'src/app/students/department.model';
import { PhysicalObject } from 'src/app/students/physical-object.model';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';
import Swal from 'sweetalert2';
import { Period } from '../period.model';

@Component({
  selector: 'app-atlas-positions',
  templateUrl: './atlas-positions.component.html',
  styleUrls: ['./atlas-positions.component.css']
})
export class AtlasPositionsComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
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
  jobInternalPositionId!: number;

  filters: AtlasFilters = new AtlasFilters();

  begin: number = 0;
  limit: number = 6;            // Number of results to fetch from the back-end
  isAppActive: boolean = false; // User can add positions only if this variable is false
  entries!: AtlasPosition[];    // The positions from atlas which are stored in a local database
  departments!: Department[];
  cities!: City[];
  physicalObjects!: PhysicalObject[];
  timer!: any;                  // Timer identifier
  waitTime: number = 500;       // Wait time in milliseconds

  canStudentSubmitApp!: boolean;
  public is_active: number = 0;
  period: Period | undefined;
  isDeclarationEnabled!: boolean;
  studentsSSOData!: Student[];
  // shorten companies name to fit in the table
  shortCompanyName: string[] = [];

  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getAtlasAEIInstitutions()
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
        this.shortCompanyName = this.entries.map(entry => Utils.add3Dots(entry.name, 31));
        this.setJobsDetails(0); // TODO: find a way to do it outside of subscribe
      });
    this.studentsService.getAtlasPhysicalObjects()
      .subscribe((fetchedPhysicalObjects: PhysicalObject[]) => {
        this.physicalObjects = fetchedPhysicalObjects;
      });
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
        this.shortCompanyName = this.entries.map(entry => Utils.add3Dots(entry.name, 31));
      });
  }

  public fetchFilteredPositions(filterArray: any) {
    // begin value needs to be refreshed (assigned to 0)
    this.begin = 0;
    this.studentsService.getAtlasFilteredPositions(this.begin, filterArray)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries.push(...positions);
        this.shortCompanyName = this.entries.map(entry => Utils.add3Dots(entry.name, 31));

        // Update job details automatically on search
        this.displayDescription(0);
      });
  }

  public fetchMoreFilteredPositions(filterArray: any, beginParam: number) {
    this.studentsService.getAtlasFilteredPositions(beginParam, filterArray)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries.push(...positions);
      });
  }

  public fetchGenericSearchPositions() {
    // begin value needs to be refreshed (assigned to 0)
    this.begin = 0;
    let inputText = this.searchInput?.nativeElement.value;

    this.studentsService.getGenericPositionSearch(this.begin, inputText)
      .subscribe((positions: AtlasPosition[]) => {
        this.entries = [];
        this.entries.push(...positions);
        this.shortCompanyName = this.entries.map(entry => Utils.add3Dots(entry.name, 31));
        // if positions are not found by searching
        if (positions.length == 0) {
          this.warnNoResultsFound();
          this.studentsService.getAtlasPositions(this.begin)
            .subscribe((positions: AtlasPosition[]) => {
              this.entries = positions;
              this.setJobsDetails(0);
          });
        }

        // Update job details automatically on search
        this.displayDescription(0);
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

  public fetchPositionsByPhysicalObject(physicalObject: any) {
    this.entries = [];
    this.filters.physicalObject = physicalObject.value == "unselected" ? null : physicalObject.value;
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

  @HostListener('window:scroll', ['$event']) onScrollEvent($event: any) {
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
    this.jobTitle = this.entries[index].title;
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
    this.jobLastUpdateString = Utils.getAtlasPreferredTimestamp(this.entries[index].positionGroupLastUpdateString);
    this.jobInternalPositionId = this.entries[index].id;
  }

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

  private warnDepartmentNotMatchesError(): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: "Αυτή η θέση δεν είναι διαθέσιμη για το τμήμα σας",
      showConfirmButton: false,
      timer: 1500
    });
  }

  private warnNoResultsFound(): void {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: "Δεν βρέθηκαν αποτελέσματα",
      showConfirmButton: false,
      timer: 1500
    });
  }
}
