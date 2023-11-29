import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepManager } from 'src/app/department-managers/dep-manager.model';
import { Period } from 'src/app/department-managers/period.model';
import { Utils } from 'src/app/MiscUtils';
import { Department } from 'src/app/students/department.model';
import Swal from 'sweetalert2';
import { OfficeUser } from '../office-user.model';
import { OfficeService } from '../office.service';

@Component({
  selector: 'app-positions-add',
  templateUrl: './positions-add.component.html',
  styleUrls: ['./positions-add.component.css']
})
export class PositionsAddComponent implements OnInit {
  public depManagerData!: DepManager;
  public periodData!: Period;
  fontSize: number = 100;
  private language!: string;
  dateFrom: string = "";
  dateTo: string = "";
  officeUserData!: OfficeUser;
  officeUserAcademics!: any[];
  @ViewChild('espaPositions') espaPositions!: ElementRef;
  @ViewChild('departmentSelect') departmentSelect!: ElementRef;
  isLoading = false;
  fallbackPositions: number = 0;

  phaseArray = ["no-state",
    "1. Αιτήσεις ενδιαφέροντος φοιτητών",
    "2. Επιλογή θέσεων από φοιτητές"];

  selectedDepartment: any = {
    academic_id: 0,
    department: ''
  };

  constructor(public officeService: OfficeService) { }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    this.officeService.getOfficeUser()
      .subscribe((officeUser: OfficeUser) => {
        this.officeUserData = officeUser;
        this.selectedDepartment.department = this.selectedDepartment.department == null ? this.officeUserData.department : this.selectedDepartment.department;
        this.selectedDepartment.academic_id = this.selectedDepartment.department == null ? this.officeUserData.department_id : this.selectedDepartment.academic_id;
        // this.officeUserData.schacdateofbirth = Utils.reformatDateOfBirth(this.officeUserData.schacdateofbirth);
        this.officeService.getPeriodByDepartmentId(this.selectedDepartment.academic_id)
          .subscribe((periodData: Period) => {
            this.periodData = periodData;
            this.dateFrom = Utils.changeDateFormat(periodData.date_from);
            this.dateTo = Utils.changeDateFormat(periodData.date_to);
        });
        this.officeService.getAcademicsByOfficeUserId()
          .subscribe((academics: any) => {
           this.officeUserAcademics = academics;
            console.log(academics);
        });
      });

  }

  submit() {
    const value = this.espaPositions.nativeElement.value;
    // this.officeService.insertEspaPosition(value, this.officeService.getDepartmentId());
    this.officeService.insertEspaPosition(value, this.selectedDepartment.academic_id);
    this.onSavePositionsAlert();
  }

  onDepartmentChange(value: any) {
    this.isLoading = true;
    this.selectedDepartment = value;
    this.officeService.getPeriodByDepartmentId(this.selectedDepartment.academic_id)
      .subscribe((periodData: Period) => {
        this.periodData = periodData;
        if (!periodData?.positions) {
          this.officeService.getEspaPositionsByDepartmentId(this.selectedDepartment.academic_id)
            .subscribe({
              next: (positionsCountFetched: any) => {
              // Set fallbackPositions instead of periodData
              this.fallbackPositions = positionsCountFetched;
              // If 0 positions are fetched it is not an issue, there are simply no positions left
              if (this.fallbackPositions == 0) {
                this.periodData.positions = 0;

                if (periodData.date_from) {
                  this.dateFrom = Utils.changeDateFormat(periodData.date_from);
                }

                if (periodData.date_to) {
                  this.dateTo = Utils.changeDateFormat(periodData.date_to);
                }
              }
              this.isLoading = false;
            }, error: (error: any) => {
              console.log(error);
              this.isLoading = false;
            }
          });
        } else {
          this.fallbackPositions = 0;
          this.dateFrom = Utils.changeDateFormat(periodData.date_from);
          this.dateTo = Utils.changeDateFormat(periodData.date_to);
          this.isLoading = false;
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.isLoading = false;
      });
  }

  private onSavePositionsAlert() {
    Swal.fire({
      title: 'Θέσεις ΕΣΠΑ',
      text: 'Επιτυχής ανάρτηση θέσεων ΕΣΠΑ',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then(() => this.ngOnInit());
  }

}
