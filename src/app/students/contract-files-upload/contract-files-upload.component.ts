import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from, mergeMap } from 'rxjs';
import Swal from 'sweetalert2';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-contract-files-upload',
  templateUrl: './contract-files-upload.component.html',
  styleUrls: ['./contract-files-upload.component.css']
})
export class ContractFilesUploadComponent implements OnInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  studentsSSOData: Student[] = [];
  fileSubmitted: boolean = false;
  @Input() periodId!: number;

  constructor(public studentsService: StudentsService, private _formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].user_ssn = this.getSSN(this.studentsSSOData[0].user_ssn);
      });

    this.firstFormGroup = this._formBuilder.group({
      // ssnControl: ['', Validators.required],
      // doyControl: ['', Validators.required],
      // amkaControl: ['', Validators.required],
      // ibanControl: ['', Validators.required],
      amaNumberControl: ['', Validators.required],
      policeIDControl: ['', Validators.required],
      // ssnFile: ['', Validators.required],
      // ibanFile: ['', Validators.required]
      amaFile: ['', Validators.required],
      idFile: ['', Validators.required],
    });
    this.contactFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      phoneCtrl: ['', Validators.required],
      addressCtrl: ['', Validators.required],
      locationCtrl: ['', Validators.required],
      cityCtrl: ['', Validators.required],
      postalCodeCtrl: ['', Validators.required]
    });
  }

  // This function is used to get the AMKA number of the student
  private getSSN(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  checkIfFieldEmpty(givenFormGroup: FormGroup, field: string): boolean {
    const fieldValue = givenFormGroup.get(field)?.value;
    return fieldValue && fieldValue != null && fieldValue != '';
  }

  /**
   * Used to update student general, contract and contact details,
   * as a controller function
   */
  updateStudentsAllDetails() {
    // check if the only required field in the last stepper is empty
    // to check if a more generic implementation can implemented
    if (!this.checkIfFieldEmpty(this.contactFormGroup, 'emailCtrl')) {
      return;
    }

    const contractsData: any = {
      // ssn: this.firstFormGroup.get('ssnControl')?.value,
      // doy: this.firstFormGroup.get('doyControl')?.value,
      // iban: this.firstFormGroup.get('ibanControl')?.value,
      ama_number: this.firstFormGroup.get('amaNumberControl')?.value,
      id_card: this.firstFormGroup.get('policeIDControl')?.value
    };
    const contractFiles: any = {
      amaFile: this.firstFormGroup.get('amaFile')?.value,
      idFile: this.firstFormGroup.get('idFile')?.value
    };
    const contactDetails: any = {
      phone: this.contactFormGroup.get('phoneCtrl')?.value,
      address: this.contactFormGroup.get('addressCtrl')?.value,
      location: this.contactFormGroup.get('locationCtrl')?.value,
      city: this.contactFormGroup.get('cityCtrl')?.value,
      post_address: this.contactFormGroup.get('postalCodeCtrl')?.value,
      mail: this.contactFormGroup.get('emailCtrl')?.value,
      country: 'gr'
    };

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

  onSubmitStudentContractDetails(data: any, contractFiles: { amaFile: any; idFile: any }) {
    const fileAMA = this.uploadFile(contractFiles.amaFile);
    const fileIdCard = this.uploadFile(contractFiles.idFile);

    let files = [
    { "fileData": fileAMA, "type": 'AMA' },
    { "fileData": fileIdCard, "type": 'IDENTITY' }];

    // Update student contract details (AMA, Police Identity Card)
    this.studentsService.updateStudentExtraContractDetails(data);

    const filesToSave = from(files).pipe(
      mergeMap(file => this.studentsService.updateStudentContractFile(file.fileData, file.type))
    );

    filesToSave.subscribe(
      (data) => console.log('File saved!'),
      (err) => console.error('error: ' + err)
    );
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
  }

  onSave() {
    Swal.fire({
      title: 'Επιτυχία',
      text: 'Τα στοιχεία που υποβάλατε ανέβηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then(() => {
      this.router.navigateByUrl('/student/sheets/' + this.studentsSSOData[0].sso_uid);
    });
  }

  onError() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Μη έγκυρος τύπος αρχείων. Υποστηριζόμενος τύπος αρχείων: .pdf .jpg .png .jpeg',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  validateFiles(formFileName: string) {
    //this.filesSubmitted[formFileName] = false;
    let formGroup = this.firstFormGroup;
    let formFile = formGroup.get(formFileName)?.value;

    if (formFile == null) {
      return;
    }

    let fileName = formFile._fileNames;
    if (!this.getExtensionExists(fileName)) {
      this.onError();
      formGroup.get(formFileName)?.setValue(null);
      formGroup.get(formFileName)?.reset();
      return;
    }

    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'pdf':
      case 'png':
        console.log('Allowed file format');
        break;
      default:
        this.onError();
        formGroup.get(formFileName)?.setValue(null);
        formGroup.get(formFileName)?.reset();
        break;
    }

    let fileSize = Number((formFile.files[0].size / (1024 * 1024)).toFixed(2));

    if (fileSize > 4) {
      Swal.fire({
        title: 'Ανέβασμα Αρχείου',
        text: 'Το αρχείο είναι μεγαλύτερο απο 4 Mb.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });
      formGroup.get(formFileName)?.setValue(null);
      formGroup.get(formFileName)?.reset();
    }
  }

  getExtensionExists(filename: string) {
    if (!filename) return false;
    return !(filename.split('.').pop() == filename);
  }

}
