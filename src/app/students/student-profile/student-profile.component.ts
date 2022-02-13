import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { Observable, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit, OnDestroy {

  studentsSSOData: Student[] = [];
  private studentSubscription!: Subscription;

  @ViewChild('fileInput',{static: false}) fileInput: ElementRef | undefined;
  @ViewChild('fileInput2', { static: false }) fileInput2: ElementRef | undefined;

  constructor(public studentsService: StudentsService) { }

  ngOnInit() {
    this.studentsService.getStudents()
    .subscribe((students: Student[]) => {
      this.studentsSSOData = students;
      this.studentsSSOData[0].schacdateofbirth = this.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
      this.studentsSSOData[0].schacpersonaluniqueid = this.getSSN(this.studentsSSOData[0].schacpersonaluniqueid);
      // console.log(this.studentsSSOData);
    });
    // this.studentSubscription = this.studentsService.getStudentUpdateListener()
  }

  // This function is used to get the AMKA of the student
  private getSSN(str: string) : string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length-1];
  }

  private reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;

    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);

    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
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
  }

  onSubmitStudentContractDetails(data: any) {
    const fileSSN = this.fileUploadSSN();
    const fileIban = this.fileUploadIban();
    this.studentsService.updateStudentContractDetails(data);
    this.studentsService.updateStudentContractSSNFile(fileSSN);
    this.studentsService.updateStudentContractIbanFile(fileIban);
  }

  onSubmitStudentBio(data: any) {
    this.studentsService.updateStudentBio(data);
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
  }

}
