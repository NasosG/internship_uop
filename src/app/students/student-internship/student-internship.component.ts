import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Period } from 'src/app/department-managers/period.model';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { AtlasFilters } from '../atlas-filters.model';
import { AtlasPosition } from '../atlas-position.model';
import { City } from '../city.model';
import { Department } from '../department.model';
import {PhysicalObject} from '../physical-object.model';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-student-internship',
  templateUrl: './student-internship.component.html',
  styleUrls: ['./student-internship.component.css']
})

export class StudentInternshipComponent implements OnInit {
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
  private INTEREST_EXPRESSION_PHASE: number = 1;
  // private STUDENT_SELECTION_PHASE: number = 2;
  private PREFERENCE_DECLARATION_PHASE: number = 2;
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
    this.studentsService.getStudentActiveApplication()
      .subscribe((num: number) => {
        console.log("active apps number: " + num);
        // if one or more apps from this student are active
        if (num >= 1) this.isAppActive = true;
      });
    console.log("active " + this.is_active);
    //this.setJobsDetails(0);
    //let fetchedPeriod = this.studentsService?.getPeriod();
    //if (fetchedPeriod)
    //this.setStudentCanSubmit(fetchedPeriod);
    // console.log("prd " + this.studentsService?.getPeriod().available_positions);
    //else {
    this.fetchStudentAndPeriod();
    //}
  }

  public fetchStudentAndPeriod() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        console.log(this.studentsSSOData);
        this.studentsService.getPhase(this.studentsSSOData[0]?.department_id)
          .subscribe((period: Period) => {
            this.period = period;
            this.studentsService.getStudentRankedApprovalStatusForPeriod(this.period.id)
              .subscribe((isApproved: boolean) => {
                this.setStudentCanSubmit(period, isApproved);
            });
            console.log(this.period + " opts enabled " + this.canStudentSubmitApp);
          });
      });
  }

  setStudentCanSubmit(period: Period, isApproved: boolean) {
    console.log(period.is_active);
    console.log(period.phase_state == this.PREFERENCE_DECLARATION_PHASE);
    console.log(this.studentsSSOData[0].phase > 1);
    this.canStudentSubmitApp = period.is_active && period.phase_state >= this.PREFERENCE_DECLARATION_PHASE && this.studentsSSOData[0].phase > 1 && isApproved;
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

  // public fetchPositionsByWorkingHours(currentCheckbox: any) {
  //   this.entries = [];
  //   this.filters.workingHours = currentCheckbox.value == "unselected" ? "" : currentCheckbox.value;
  //   this.fetchFilteredPositions(this.filters);
  // }

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

  // The below were commented out after working hours checkboxes were removed from filters
  // public selectAll() {
  //   let selectAllCheckbox: any = document.getElementById('select-all');
  //   let checkboxes: any = document.getElementsByName('check-boxes');
  //   for (let checkbox of checkboxes) {
  //     checkbox.checked = selectAllCheckbox.checked;
  //   }
  //   this.fetchPositionsByWorkingHours(selectAllCheckbox);
  // }

  // public selectOneOption(id: string) {
  //   let selectAllCheckbox: any = document.getElementById('select-all');
  //   let checkboxes: any = document.getElementsByName('check-boxes');
  //   let currentCheckbox: any = document.getElementById(id);

  //   for (let checkbox of checkboxes) {
  //     selectAllCheckbox.checked = checkbox.checked = false;
  //   }

  //   currentCheckbox.checked = true;
  //   this.fetchPositionsByWorkingHours(currentCheckbox);
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

  addPosition(positionId: number, jobInternalPositionId: number, availablePositions: number) {
    let message = "";

    if (!this.canStudentSubmitApp) {
      (document.getElementById("addPositionsBtn") as HTMLButtonElement).textContent = "ΧΩΡΙΣ ΔΥΝΑΤΟΤΗΤΑ ΠΡΟΣΘΗΚΗΣ ΘΕΣΗΣ";
      return;
    }
    let atlas = true;
    // Below "if" was used for job positions that were not from atlas but from our database
    if (!positionId) {
      positionId = jobInternalPositionId;
      atlas = false;
    }

    if (availablePositions == 0) {
       Swal.fire({
        position: 'center',
        icon: 'warning',
        title: "Οι διαθέσιμες θέσεις για αυτή τη θέση πρακτικής έχουν εκπληρωθεί",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // this.studentsService.getStudentPositionMatchesAcademic(positionId, this.studentsSSOData[0].department_id)
    // .subscribe((responseData: boolean) => {
      // if (responseData !== true) {
      //   this.warnDepartmentNotMatchesError();
      //   return;
      // }

      this.studentsService.insertStudentPosition(positionId, atlas).subscribe(responseData => {
        message = responseData.message;

        // check if student tries to choose more than 5 positions
        if (message === "Student can't choose more than 5 positions") {
          console.log("Can't choose more than 5 positions");
          this.warnIllegalPositionNumber();
          return;
        }
        // check if student tries to select the same position or another error occurrs
        else if (message.includes("Error while inserting student positions")) {
          this.warnError();
          return;
        }

        this.addedPositionSuccess();
      });
    // });
  }

  private addedPositionSuccess(): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: "Η θέση προστέθηκε",
      showConfirmButton: false,
      timer: 1500
    });
  }

  private warnError(): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: "Δεν μπορείτε να επιλέξετε την ίδια θέση.",
      showConfirmButton: false,
      timer: 1500
    });
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

  private warnIllegalPositionNumber(): void {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: "Δε μπορείτε να επιλέξετε πάνω από 5 θέσεις",
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

  checkIfActiveAppExists() {
    this.studentsService.getStudentActiveApplication()
      .subscribe((num: number) => {
        console.log(num);
        // if (num == 1) return true;
        // else return false;
      });

    return false;
  }

}
