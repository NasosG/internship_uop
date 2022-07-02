import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {City} from 'src/app/students/city.model';
import {Country} from 'src/app/students/country.model';
import {Department} from 'src/app/students/department.model';
import {PhysicalObject} from 'src/app/students/physical-object.model';
import {Prefecture} from 'src/app/students/prefecture.model';
import {StudentsService} from 'src/app/students/student.service';
import Swal from 'sweetalert2';
import {CompanyService} from '../company.service';

@Component({
  selector: 'app-position-upload',
  templateUrl: './position-upload.component.html',
  styleUrls: ['./position-upload.component.css']
})
export class PositionUploadComponent implements OnInit, AfterViewInit {
  physicalObjectForm = new FormControl('');

  list: string[] = ['option1', 'option2', 'option3', 'option4', 'option5', 'option6'];
  listPositionsNumber: string[] = ['1', '2', '3', '4', '5'];
  departments: Department[] | undefined;
  cities: City[] | undefined;
  prefectures: City[] | undefined;
  countries!: Country[];
  physicalObjects: PhysicalObject[] | undefined;
  selectedCountry: string = 'Greece';
  @ViewChild('duration') duration!: ElementRef;
  companyInsertFormGroup!: FormGroup;
  jobTypes = ['Πλήρες ωράριο', 'Μερικό ωράριο'];
  errorDuration: boolean = false;
  private _formBuilder: any;

  constructor(private studentsService: StudentsService, private companyService: CompanyService, private formBuilder: FormBuilder) {
    this.companyInsertFormGroup = new FormGroup({
      country: new FormControl()
    });
  }

  ngOnInit(): void {
    this.studentsService.getAtlasInstitutions()
      .subscribe((fetchedDepartments: Department[]) => {
        this.departments = fetchedDepartments;
      });
    this.studentsService.getAtlasCities()
      .subscribe((fetchedCities: City[]) => {
        this.cities = fetchedCities;
      });
    this.studentsService.getAtlasPrefectures()
      .subscribe((fetchedPrefectures: Prefecture[]) => {
        this.prefectures = fetchedPrefectures;
      });
    this.studentsService.getAtlasCountries()
      .subscribe((fetchedCountries: Country[]) => {
        this.countries = fetchedCountries;
      });
    this.studentsService.getAtlasPhysicalObjects()
      .subscribe((fetchedPhysicalObjects: PhysicalObject[]) => {
        this.physicalObjects = fetchedPhysicalObjects;
      });
    let element: any = document.getElementById("multiple-selected");
    element.selectpicker();

    this.companyInsertFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.setForm();
  }

  setForm() {
    this.companyInsertFormGroup.patchValue({
      country: "Ελλάδα"
    });
  }

  onKeyUpValidateFields(field: string) {
    switch (field) {
      case 'duration':
        if (parseInt(this.duration?.nativeElement.value) > 12) {
          this.errorDuration = true;
        } else {
          this.errorDuration = false;
        }
      break;
    }
  }

  uploadPosition() {
    Swal.fire({
      title: 'Ανάρτηση Θέσεων',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην τελική ανάρτηση των θέσεων για πρακτική άσκηση;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("Redirect for cancel");
        } else {
          this.companyService.insertNewPosition();
        }
    });
  }
}
