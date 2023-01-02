import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepManager } from 'src/app/department-managers/dep-manager.model';
import { Period } from 'src/app/department-managers/period.model';
import { Utils } from 'src/app/MiscUtils';
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
  officeUserAcademics!: any;
  @ViewChild('espaPositions') espaPositions!: ElementRef;

  phaseArray = ["no-state",
    "1. Φάση ελέγχου επιλεξιμότητας.",
    "2. Φάση επιλογής φοιτητών",
    "3. Δήλωση προτίμησης από τους φοιτητές",
    "4. Επιλογή φοιτητών από φορείς"];

  constructor(public officeService: OfficeService) { }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    // this.authService.login('');
    this.officeService.getOfficeUser()
      .subscribe((officeUser: OfficeUser) => {
        this.officeUserData = officeUser;
        // this.officeUserData.schacdateofbirth = Utils.reformatDateOfBirth(this.officeUserData.schacdateofbirth);
        this.officeService.getPeriodByDepartmentId(this.officeUserData.department_id)
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
    this.officeService.insertEspaPosition(value, this.officeService.getDepartmentId());
    this.onSavePositionsAlert();
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
    }).then(() => location.reload());
  }

}
