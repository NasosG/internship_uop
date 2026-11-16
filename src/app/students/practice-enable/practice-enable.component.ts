import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, concatMap, forkJoin, from, map, Observable, of, throwError, toArray } from 'rxjs';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { ibanAsyncValidator } from 'src/app/shared/validators/iban-validator';
import { adtAsyncValidator } from 'src/app/shared/validators/identityCard-validator';

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
  // while the application is being submitted (the button is disabled)
  isSubmitting: boolean = false;
  programsOfStudy: string[] = [];
  @Input() periodId!: number;

  public academicsMerged = [{
    academicId: 1522,
    programOfStudy: ['ΠΣ AE Ηλεκτρολόγων Μηχανικών και Μηχανικών Η/Υ',
      'ΠΣ ΤΕ Ηλεκτρολόγων Μηχανικών ΤΕ',
      'ΠΣ ΤΕ Μηχανικών Πληροφορικής ΤΕ'],
  },
  {
    academicId: 1523,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Μηχανολόγων Μηχανικών', 'ΠΣ ΤΕ Μηχανολόγων Μηχανικών ΤΕ']
  },
  {
    academicId: 1524,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Πολιτικών Μηχανικών', 'ΠΣ ΤΕ Πολιτικών Μηχανικών ΤΕ']
  },
  {
    academicId: 1513,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Λογιστικής και Χρηματοοικονομικής', 'ΠΣ ΤΕ Λογιστικής και Χρηματοοικονομικής']
  },
  {
    academicId: 1514,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Διοίκησης Επιχειρήσεων και Οργανισμών', 'ΠΣ ΤΕ Διοίκησης Επιχειρήσεων και Οργανισμών']
  },
  {
    academicId: 1515,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Λογοθεραπείας', 'ΠΣ ΤΕ Λογοθεραπείας']
  },
  {
    academicId: 1511,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Γεωπονίας', 'ΠΣ ΤΕ Τεχνολόγων Γεωπόνων']
  },
  {
    academicId: 1512,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Επιστήμης και Τεχνολογίας Τροφίμων', 'ΠΣ ΤΕ Τεχνολογίας Τροφίμων']
  },
  {
    academicId: 1519,
    programOfStudy: ['ΠΣ ΠΕ Τμήμα Ψηφιακών Συστημάτων', 'ΠΣ ΤΕ Μηχανικών Πληροφορικής']
  }];

  // return true if program of study is merged and return the programs of study
  // depending on the academicsMerged json array
  isProgramOfStudyMerged(academicId: number | undefined) {
    if (!academicId) {
      return false;
    }

    if (Utils.isTechTEIDepartment(academicId)) {
      academicId = Utils.getAEICodeFromDepartmentId(academicId);
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

  constructor(public studentsService: StudentsService, private _formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.gender = this.studentsSSOData[0].schacgender == 1 ? 'Άνδρας' : 'Γυναίκα';
        // this.studentsSSOData[0].department_id = 1511; // only for testing purposes
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
      genderCtrl: ['', Validators.required],
      isProgramStudyUpgradedCtrl: [''],
      programOfStudyMergedCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      policeIDControl: ['', Validators.required, adtAsyncValidator()],
      ssnControl: ['', Validators.required],
      doyControl: ['', Validators.required],
      amkaControl: ['', Validators.required],
      ibanControl: ['', Validators.required, ibanAsyncValidator()],
      amaNumberControl: ['', Validators.required],
      ssnFile: ['', Validators.required],
      ibanFile: ['', Validators.required],
      amaFile: ['', Validators.required],
      idFile: ['', Validators.required]
    });
    this.contactFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      phoneCtrl: [],
      addressCtrl: ['', Validators.required],
      locationCtrl: ['', Validators.required],
      cityCtrl: ['', Validators.required],
      postalCodeCtrl: ['', Validators.required]
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
    if (!this.checkIfFieldEmpty(this.contactFormGroup, 'emailCtrl') || this.isSubmitting) {
      return;
    }
    const generalDetailsData: any = {
      father_name: this.firstFormGroup.get('fatherNameCtrl')?.value,
      father_last_name: this.firstFormGroup.get('fatherSurnameCtrl')?.value,
      mother_name: this.firstFormGroup.get('motherNameCtrl')?.value,
      mother_last_name: this.firstFormGroup.get('motherSurnameCtrl')?.value
    };
    const contractsData: any = {
      id_card: this.secondFormGroup.get('policeIDControl')?.value,
      ssn: this.secondFormGroup.get('ssnControl')?.value,
      doy: this.secondFormGroup.get('doyControl')?.value,
      // stored as it is validated: without spaces, in capitals
      iban: this.secondFormGroup.get('ibanControl')?.value?.replace(/\s+/g, '').toUpperCase(),
      ama: this.secondFormGroup.get('amaNumberControl')?.value
    };
    const contractFiles: any = {
      ssnFile: this.secondFormGroup.get('ssnFile')?.value,
      ibanFile: this.secondFormGroup.get('ibanFile')?.value,
      ameaFile: this.specialDataFormGroup.get('ameaFile')?.value,
      affidavitFile: this.specialDataFormGroup.get('affidavitFile')?.value,
      amaFile: this.secondFormGroup.get('amaFile')?.value,
      idFile: this.secondFormGroup.get('idFile')?.value
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
    const specialDetails: any = {
      military_training: this.specialDataFormGroup.get('armyCatCtrl')?.value,
      working_state: this.specialDataFormGroup.get('workingCatCtrl')?.value,
      amea_cat: this.specialDataFormGroup.get('ameaCatCtrl')?.value
    };
    const departmentDetails: any = {
      isStudyProgramUpgraded: this.firstFormGroup.get('isProgramStudyUpgradedCtrl')?.value,
      currentStudyProgram: this.firstFormGroup.get('programOfStudyMergedCtrl')?.value,
      departmentId: this.studentsSSOData[0].department_id,
      studyProgramId: this.getProgramOfStudy(this.firstFormGroup.get('programOfStudyMergedCtrl')?.value)
    };

    const detailsRequests: Observable<any>[] = [
      this.studentsService.updateStudentDetailsRequest(generalDetailsData),
      this.studentsService.updateStudentContractDetailsRequest(contractsData),
      this.studentsService.updateStudentContactRequest(contactDetails),
      this.studentsService.updateStudentSpecialDetailsRequest(specialDetails)
    ];
    if (this.isProgramOfStudyMerged(departmentDetails.departmentId)) {
      detailsRequests.push(this.studentsService.insertOrUpdateDepartmentDetailsRequest(departmentDetails));
    }

    // The details, then the files, then the application: each only when the previous ones were saved, so that the
    // student never sees "success" while something is missing (if something fails, pressing the button again resends it)
    this.isSubmitting = true;
    forkJoin(detailsRequests).pipe(
      concatMap(() => this.uploadContractFiles(contractFiles)),
      concatMap((failedFiles: string[]) => failedFiles.length > 0
        ? throwError(() => ({ failedFiles }))
        : this.onSubmitStudentInterestApp(this.periodId)),
      concatMap(() => this.studentsService.updatePhaseRequest(1))
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.onSave();
      },
      error: (error: any) => {
        this.isSubmitting = false;
        if (error?.failedFiles) {
          this.onFilesError(error.failedFiles);
        } else {
          this.onSubmitError();
        }
      }
    });
  }


  getProgramOfStudy(value: string): number {
    const index = this.academicsMerged.findIndex(academic => academic.programOfStudy.includes(value));
    if (index !== -1) {
      const programOfStudyIndex = this.academicsMerged[index].programOfStudy.indexOf(value);
      let identifier: number = Number.parseInt(this.academicsMerged[index].academicId + "0" + programOfStudyIndex);

      // Check if last 2 digits are 0, if so, remove them
      if (identifier % 100 === 0) {
        identifier = Math.floor(identifier / 100);
      }

      return identifier;
    } else {
      console.log("the selected value is not in academicsMerged");
      // If the selected value is not in academicsMerged, then theres only one program of study
      return this.studentsSSOData[0].department_id;
    }
  }

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  onSubmitStudentInterestApp(periodId: number): Observable<any> {
    console.log("periodId: " + periodId);
    return this.studentsService.createStudentInterestApp(periodId);
  }

  /**
   * Uploads the files one after the other
   * @returns the names of the files that were not saved (empty when all were saved)
   */
  uploadContractFiles(contractFiles: { ssnFile: any; ibanFile: any, ameaFile: any, affidavitFile: any, amaFile: any, idFile: any }): Observable<string[]> {
    const isAmeaCatSelected = this.specialDataFormGroup.get('ameaCatCtrl')?.value == "1";

    const files: Array<{ fileData: any; type: string; name: string }> = [
      { fileData: this.uploadFile(contractFiles.ssnFile), type: 'SSN', name: 'ΑΦΜ' },
      { fileData: this.uploadFile(contractFiles.ibanFile), type: 'IBAN', name: 'IBAN' },
      { fileData: this.uploadFile(contractFiles.affidavitFile), type: 'AFFIDAVIT', name: 'Υπεύθυνη Δήλωση' },
      { fileData: this.uploadFile(contractFiles.amaFile), type: 'AMA', name: 'ΑΜΑ' },
      { fileData: this.uploadFile(contractFiles.idFile), type: 'IDENTITY', name: 'Ταυτότητα' },
    ];

    if (isAmeaCatSelected && contractFiles.ameaFile) {
      files.push({ fileData: this.uploadFile(contractFiles.ameaFile), type: 'AMEA', name: 'ΑμεΑ' });
    }

    return from(files).pipe(
      concatMap(file => (this.studentsService.updateStudentFile(file.fileData, file.type) as Observable<any>).pipe(
        map((response: any) => response?.message == 'ERROR' ? file.name : ''),
        catchError(() => of(file.name))
      )),
      toArray(),
      map((names: string[]) => names.filter(name => name != ''))
    );
  }

  onSave() {
    Swal.fire({
      title: 'Εκδήλωση Ενδιαφέροντος',
      text: 'Η εκδήλωση ενδιαφέροντος έγινε επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then(() => {
      this.router.navigateByUrl('/student/' + this.studentsSSOData[0].sso_uid);
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

  onSubmitError() {
    Swal.fire({
      title: 'Αποτυχία ενημέρωσης στοιχείων',
      text: 'Παρουσιάστηκε ένα πρόβλημα κατά την υποβολή της αίτησής σου και η αίτηση δεν υποβλήθηκε. Παρακαλούμε δοκίμασε ξανά.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  onFilesError(fileNames: string[]) {
    Swal.fire({
      title: 'Η αίτηση δεν υποβλήθηκε',
      text: 'Δεν ανέβηκαν τα αρχεία: ' + fileNames.join(', ') + '. Έλεγξε ότι είναι pdf, jpg ή png έως 4 MB '
        + 'και πάτησε ξανά «Ολοκλήρωση». Τα υπόλοιπα στοιχεία σου έχουν αποθηκευτεί.',
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

    let ext = fileName.match(/\.([^\.]+)$/)[1].toLowerCase();
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

  validateVATNumber(): void {
    const ssnControl = this.secondFormGroup.get('ssnControl');
    // Handle if control doesn't exist
    if (!ssnControl) return;

    const vatValue = ssnControl.value;
    if (!vatValue) return; // No error if the field is empty

    if (!Utils.TaxNumRule(vatValue)) {
      ssnControl.setErrors({ customVatError: true }); // Set the custom error
    }
  }

}

