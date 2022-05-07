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

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef | undefined;
  @ViewChild('fileInput2', { static: false }) fileInput2: ElementRef | undefined;
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

  // Used to update student general, contract and contact details
  updateStudentsAllDetails() {
    // let generalDetailsData : any[] = [];
    const generalDetailsData : any = {
        father_name: this.firstFormGroup.get('fatherNameCtrl')?.value,
        father_last_name: this.firstFormGroup.get('fatherSurnameCtrl')?.value,
        mother_name: this.firstFormGroup.get('motherNameCtrl')?.value,
        mother_last_name: this.firstFormGroup.get('motherSurnameCtrl')?.value
    };

    console.log(generalDetailsData);
    //var formData: any = new FormData();
    //formData.append("name", this.firstFormGroup.get('name')?.value);
    //formData.append("avatar", this.form.get('avatar').value);
    this.onSubmitStudentDetails(generalDetailsData);
  }

  fileUploadSSN(): FormData {
    const imageBlob = this.fileInput?.nativeElement.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  fileUploadIban(): FormData {
    const imageBlob = this.fileInput2?.nativeElement.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  onSubmitStudentDetails(data: any) {
    console.log(data);
    this.studentsService.updateStudentDetails(data);
    this.onSave();
  }

  onSubmitStudentContractDetails(data: any) {
    const fileSSN = this.fileUploadSSN();
    const fileIban = this.fileUploadIban();
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
    }).then((result) => {
      // Reload the Page
      // To be changed in the future refresh strategy is not good
      location.reload();
    });
  }

}

