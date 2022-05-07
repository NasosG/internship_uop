import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-practice-enable',
  templateUrl: './practice-enable.component.html',
  styleUrls: ['./practice-enable.component.css']
})

/**
 * @title enable practice with vertical stepper
 */
export class PracticeEnableComponent implements OnInit {

   @ViewChild('fileInput', { static: false }) fileInput: ElementRef | undefined;
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  studentsSSOData: Student[] = [];
  gender!: String;

  constructor(public studentsService: StudentsService, private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.gender = this.studentsSSOData[0].schacgender == 1 ? 'Άνδρας' : 'Γυναίκα';
        this.studentsSSOData[0].schacdateofbirth = this.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
        this.studentsSSOData[0].schacpersonaluniqueid = this.getSSN(this.studentsSSOData[0].schacpersonaluniqueid);
      });
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      surnameCtrl: ['', Validators.required],
      fatherNameCtrl: ['', Validators.required],
      fatherSurnameCtrl: ['', Validators.required],
      motherNameCtrl: ['', Validators.required],
      motherSurnameCtrl: ['', Validators.required],
      dobCtrl: ['', Validators.required],
      genderCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      ssnControl: ['', Validators.required],
      ssnFile: ['', Validators.required],
      doyControl: ['', Validators.required],
      amkaControl: ['', Validators.required],
      ibanControl: ['', Validators.required],
      ibanFile: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      // phoneCtrl: ['', Validators.required]
      phoneCtrl: []
    });
  }

  // This function is used to get the AMKA of the student
  private getSSN(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  private reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;
    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);

    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

}

