import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concatMap, forkJoin, from, mergeMap } from 'rxjs';
import { Utils } from 'src/app/MiscUtils';
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
  contactFormGroup!: FormGroup;
  specialDataFormGroup!: FormGroup;
  studentsSSOData: Student[] = [];
  gender!: String;
  fileSubmitted: boolean = false;
  programsOfStudy: string[] = [];

  public academicsMerged = [{
    academicId: 1522,
    programOfStudy: ['AEI Ηλεκτρολόγων Μηχανικών και Μηχανικών Η/Υ',
      'ΤΕΙ Ηλεκτρολόγων Μηχανικών ΤΕ',
      'ΤΕΙ Μηχανικών Πληροφορικής ΤΕ']
  },
  {
    academicId: 1523,
    programOfStudy: ['AEI Τμήμα Μηχανολόγων Μηχανικών', 'ΤΕΙ Μηχανολόγων Μηχανικών ΤΕ']
  },
  {
    academicId: 1524,
    programOfStudy: ['AEI Τμήμα Πολιτικών Μηχανικών', 'ΤΕΙ "Πολιτικών Μηχανικών ΤΕ']
  },
  {
    academicId: 1513,
    programOfStudy: ['AEI Τμήμα Λογιστικής και Χρηματοοικονομικής', 'ΤΕΙ Λογιστικής και Χρηματοοικονομικής']
  },
  {
    academicId: 1514,
    programOfStudy: ['AEI Τμήμα Διοίκησης Επιχειρήσεων και Οργανισμών', 'ΤΕΙ Διοίκησης Επιχειρήσεων και Οργανισμών']
  },
  {
    academicId: 1515,
    programOfStudy: ['AEI Τμήμα Λογοθεραπείας', 'ΤΕΙ Λογοθεραπείας']
  },
  {
    academicId: 1511,
    programOfStudy: ['AEI Τμήμα Γεωπονίας', 'ΤΕΙ Τεχνολόγων Γεωπόνων']
  },
  {
    academicId: 1512,
    programOfStudy: ['AEI Τμήμα Επιστήμης και Τεχνολογίας Τροφίμων', 'ΤΕΙ Τεχνολογίας Τροφίμων']
  },
  {
    academicId: 1519,
    programOfStudy: ['AEI Τμήμα Ψηφιακών Συστημάτων', 'ΤΕΙ Μηχανικών Πληροφορικής']
  },
  ];

  // return true if program of study is merged and return the programs of study
  // depending on the academicsMerged json array
  isProgramOfStudyMerged(academicId: number | undefined) {
    if (!academicId) {
      return false;
    }

    const academic = this.academicsMerged.find(academic => academic.academicId === academicId);
    if (academic) {
      this.programsOfStudy = academic.programOfStudy;
      return true;
    }

    return false;
  }

  hideFileIfNotAMEA(value: boolean) {
    this.fileSubmitted = value;
  }

  constructor(public studentsService: StudentsService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.gender = this.studentsSSOData[0].schacgender == 1 ? 'Άνδρας' : 'Γυναίκα';
        this.studentsSSOData[0].schacdateofbirth = Utils.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
        this.studentsSSOData[0].user_ssn = this.getSSN(this.studentsSSOData[0].user_ssn);
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
    this.contactFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      phoneCtrl: [],
      addressCtrl: [],
      locationCtrl: [],
      cityCtrl: [],
      postalCodeCtrl: []
    });
    this.specialDataFormGroup = this._formBuilder.group({
      ameaCatCtrl: ['', Validators.required],
      ameaFile: ['', /*TODO make it required if student chooses amea5 from dropdown Validators.required*/],
      affidavitFile: ['', Validators.required],
      workingCatCtrl: ['', Validators.required],
      armyCatCtrl: ['', Validators.required]
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
    const generalDetailsData: any = {
      father_name: this.firstFormGroup.get('fatherNameCtrl')?.value,
      father_last_name: this.firstFormGroup.get('fatherSurnameCtrl')?.value,
      mother_name: this.firstFormGroup.get('motherNameCtrl')?.value,
      mother_last_name: this.firstFormGroup.get('motherSurnameCtrl')?.value
    };
    const contractsData: any = {
      ssn: this.secondFormGroup.get('ssnControl')?.value,
      doy: this.secondFormGroup.get('doyControl')?.value,
      iban: this.secondFormGroup.get('ibanControl')?.value
    };
    const contractFiles: any = {
      ssnFile: this.secondFormGroup.get('ssnFile')?.value,
      ibanFile: this.secondFormGroup.get('ibanFile')?.value,
      ameaFile: this.specialDataFormGroup.get('ameaFile')?.value,
      affidavitFile: this.specialDataFormGroup.get('affidavitFile')?.value
    };
    const contactDetails: any = {
      phone: this.contactFormGroup.get('phoneCtrl')?.value,
      address: this.contactFormGroup.get('addressCtrl')?.value,
      location: this.contactFormGroup.get('locationCtrl')?.value,
      city: this.contactFormGroup.get('cityCtrl')?.value,
      post_address: this.contactFormGroup.get('postalCodeCtrl')?.value,
      country: 'gr'
    };

    const specialDetails: any = {
      military_training: this.specialDataFormGroup.get('armyCatCtrl')?.value,
      working_state: this.specialDataFormGroup.get('workingCatCtrl')?.value,
      amea_cat: this.specialDataFormGroup.get('ameaCatCtrl')?.value
    };

    this.onSubmitStudentDetails(generalDetailsData);
    this.onSubmitStudentContractDetails(contractsData, contractFiles);
    this.onSubmitStudentContact(contactDetails);
    this.onSubmitStudentSpecialDetails(specialDetails);
    this.setPhase(1);
    this.onSave();
  }

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  onSubmitStudentDetails(data: any) {
    this.studentsService.updateStudentDetails(data);
  }

  onSubmitStudentSpecialDetails(data: any) {
    this.studentsService.updateStudentSpecialDetails(data);
  }

  setPhase(phase: number) {
    this.studentsService.updatePhase(phase);
  }

  onSubmitStudentContractDetails(data: any, contractFiles: { ssnFile: any; ibanFile: any, ameaFile: any, affidavitFile: any }) {
    const fileSSN = this.uploadFile(contractFiles.ssnFile);
    const fileIban = this.uploadFile(contractFiles.ibanFile);
    const fileAffidavit = this.uploadFile(contractFiles.affidavitFile);

    const fileAmea = !contractFiles.ameaFile ? null : this.uploadFile(contractFiles.ameaFile);
    const isAmeaCatSelected = this.specialDataFormGroup.get('ameaCatCtrl')?.value == "1"

    let files;
    if (isAmeaCatSelected && fileAmea != null) {
      files = [{ "fileData": fileSSN, "type": 'SSN' },
      { "fileData": fileIban, "type": 'IBAN' },
      { "fileData": fileAffidavit, "type": 'AFFIDAVIT' },
      { "fileData": fileAmea, "type": 'AMEA' }];
    } else {
      files = [{ "fileData": fileSSN, "type": 'SSN' },
      { "fileData": fileIban, "type": 'IBAN' },
      { "fileData": fileAffidavit, "type": 'AFFIDAVIT' }];
    }

    this.studentsService.updateStudentContractDetails(data);

    const filesToSave = from(files).pipe(
      mergeMap(file => this.studentsService.updateStudentFile(file.fileData, file.type))
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
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  onError() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Μη έγκυρος τύπος αρχείων. Υποστηριζόμενος τύπος αρχέιων: .pdf .jpg .png .webp .jpeg .gif .doc .docx',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  validateFiles(formFileName: string) {
    //this.filesSubmitted[formFileName] = false;
    let formGroup = (this.secondFormGroup.contains(formFileName)) ? this.secondFormGroup : this.specialDataFormGroup;
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
      case 'doc':
      case 'docx':
      case 'gif':
      case 'webp':
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
    return !(filename.split('.').pop() == filename);
  }

}

