import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { mergeMap, Observable, Subscription, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit, OnDestroy {

  studentsSSOData: Student[] = [];
  private studentSubscription!: Subscription;
  public error = false;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef | undefined;
  @ViewChild('fileInput2', { static: false }) fileInput2: ElementRef | undefined;

  constructor(public studentsService: StudentsService, public renderer: Renderer2) { }

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].schacdateofbirth = this.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
        this.studentsSSOData[0].user_ssn = this.getSSN(this.studentsSSOData[0].user_ssn);
        // console.log(this.studentsSSOData);
      });
    // this.studentSubscription = this.studentsService.getStudentUpdateListener()
  }

  // This function is used to get the AMKA of the student
  private getSSN(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  private reformatDateOfBirth(dateOfBirth: string) {
    if (!dateOfBirth) return "";
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
    this.onSave();
  }

  onSubmitStudentContractDetails(data: any) {
    let err = false;
    const fileSSN = this.fileUploadSSN();
    const fileIban = this.fileUploadIban();
    this.studentsService.updateStudentContractDetails(data);

    this.studentsService.updateStudentContractSSNFile(fileSSN)
      .subscribe((responseData: { message: any; }) => {
        console.log("ssn " + responseData.message);
        if (responseData.message === "ERROR") {
          err = true;
          this.onErr();
        }
      })
      .pipe(
        mergeMap(this.studentsService.updateStudentContractIbanFile(fileIban)
          .subscribe((responseIbanData: { message: any; }) => {
            console.log("iban " + responseIbanData.message);
            if (err || responseIbanData.message === "ERROR") this.onErr();
            else this.onSave();
          })
        ));
  }

  onSubmitStudentBio(data: any) {
    this.studentsService.updateStudentBio(data);
    this.onSave();
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
    this.onSave();
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
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

  onErr() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Μη έγκυρος τύπος αρχείων. Υποστηριζόμενος τύπος αρχέιων: .pdf .jpg .png .webp .jpeg .gif .doc .docx',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      // Reload the Page
      // To be changed in the future refresh strategy is not good
      // location.reload();
    });
  }

  validateSsnFIle(docType: string) {
    let elementValue = this.fileInput?.nativeElement.files[0].name;
    if (elementValue == null) {
      return;
    }
    let fileName = elementValue;
    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'pdf':
      case 'png':
      case 'doc':
      case 'docx':
      case 'gif':
      case 'webp':
        console.log('Allowed file format');
        break;
      default:
        this.onErr();
        this.renderer?.setProperty(this.fileInput?.nativeElement, 'value', '');
        break;
    }
  }

  validateIbanFIle(docType: string) {
    let elementValue = this.fileInput2?.nativeElement.files[0].name;
    if (elementValue == null) {
      return;
    }
    let fileName = elementValue;
    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'pdf':
      case 'png':
      case 'doc':
      case 'docx':
      case 'gif':
      case 'webp':
        console.log('Allowed file format');
        break;
      default:
        this.onErr();
        this.renderer?.setProperty(this.fileInput2?.nativeElement, 'value', '');
        break;
    }
  }

}
