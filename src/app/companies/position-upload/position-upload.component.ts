import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {City} from 'src/app/students/city.model';
import {Department} from 'src/app/students/department.model';
import {StudentsService} from 'src/app/students/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-position-upload',
  templateUrl: './position-upload.component.html',
  styleUrls: ['./position-upload.component.css']
})
export class PositionUploadComponent implements OnInit {
  physicalObjectForm = new FormControl('');

  list: string[] = ['option1', 'option2', 'option3', 'option4', 'option5', 'option6'];
  listPositionsNumber: string[] = ['1', '2', '3', '4', '5'];
  departments: Department[] | undefined;
  cities: City[] | undefined;
  prefectures: City[] | undefined;
  constructor(private studentsService: StudentsService) { }

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
      .subscribe((fetchedPrefectures: City[]) => {
        this.prefectures = fetchedPrefectures;
      });
    let element: any = document.getElementById("multiple-selected");
    element.selectpicker();
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
    });
  }
}
