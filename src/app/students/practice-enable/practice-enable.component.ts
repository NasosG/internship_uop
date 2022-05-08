import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
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
      doyControl: ['', Validators.required],
      amkaControl: ['', Validators.required],
      ibanControl: ['', Validators.required],
      ssnFile: ['', Validators.required],
      ibanFile: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      phoneCtrl: [],
      addressCtrl: [],
      locationCtrl:[],
      cityCtrl: [],
      postalCodeCtrl: []
    });
  }

  // This function is used to get the AMKA number of the student
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


  /**
   * Used to update student general, contract and contact details,
   * as a controller function
   */
  updateStudentsAllDetails() {
    const generalDetailsData : any = {
        father_name: this.firstFormGroup.get('fatherNameCtrl')?.value,
        father_last_name: this.firstFormGroup.get('fatherSurnameCtrl')?.value,
        mother_name: this.firstFormGroup.get('motherNameCtrl')?.value,
        mother_last_name: this.firstFormGroup.get('motherSurnameCtrl')?.value
    };
    const contractsData : any = {
        ssn: this.secondFormGroup.get('ssnControl')?.value,
        doy: this.secondFormGroup.get('doyControl')?.value,
        iban: this.secondFormGroup.get('ibanControl')?.value,
    };
    const contractFiles : any = {
        ssnFile: this.secondFormGroup.get('ssnFile')?.value,
        ibanFile: this.secondFormGroup.get('ibanFile')?.value
    };
    const contactDetails: any =  {
      phone: this.thirdFormGroup.get('phoneCtrl')?.value,
      address: this.thirdFormGroup.get('addressCtrl')?.value,
      location:this.thirdFormGroup.get('locationCtrl')?.value,
      city: this.thirdFormGroup.get('cityCtrl')?.value,
      post_address: this.thirdFormGroup.get('postalCodeCtrl')?.value,
      country: 'gr'
    }

    this.onSubmitStudentDetails(generalDetailsData);
    this.onSubmitStudentContractDetails(contractsData, contractFiles);
    this.onSubmitStudentContact(contactDetails);
    this.onSave();
  }

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  onSubmitStudentDetails(data: any) {
    console.log(data);
    this.studentsService.updateStudentDetails(data);
  }

  onSubmitStudentContractDetails(data: any, contractFiles: {ssnFile: any; ibanFile: any;}) {
    const fileSSN = this.uploadFile(contractFiles.ssnFile);
    const fileIban = this.uploadFile(contractFiles.ibanFile);
    this.studentsService.updateStudentContractDetails(data);
    this.studentsService.updateStudentContractSSNFile(fileSSN);
    this.studentsService.updateStudentContractIbanFile(fileIban);
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
  }

  onSave() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
    // .then((result) => {
      // Reload the Page
      // To be changed in the future refresh strategy is not good
      //location.reload();
    // });
  }

}

