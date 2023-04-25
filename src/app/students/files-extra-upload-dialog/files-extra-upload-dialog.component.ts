import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentsService } from '../student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-files-extra-upload-dialog',
  templateUrl: './files-extra-upload-dialog.component.html',
  styleUrls: ['./files-extra-upload-dialog.component.css']
})
export class FilesExtraUploadDialogComponent implements OnInit {
  filesSubmitted: any = {
    "ameaFile": false,
    "affidavitFile": false,
    "ssnFile":false,
    "ibanFile":false
  };
  filesUploadFormGroup!: FormGroup;
  fileSubmitted: boolean = false;
  @ViewChild('commentsArea') commentsArea!: ElementRef;
  comment!: any;
  public isStudentAMEA5!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FilesExtraUploadDialogComponent>,
    public studentsService: StudentsService,
    private _formBuilder: FormBuilder
  ) { }

  hideFileIfNotAMEA(value: boolean) {
    this.fileSubmitted = value;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.isStudentAMEA5 = this.data.studentsData.amea_cat;
    this.filesUploadFormGroup = this._formBuilder.group({
      ameaFile: [''],
      affidavitFile: ['', Validators.required],
      ssnFile: ['', Validators.required],
      ibanFile: ['', Validators.required]
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

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  receiveFile(fileParam: string) {
    try {
      let formGroup = this.filesUploadFormGroup;
      const file = (formGroup.get(fileParam)?.value.files[0]);
      window.open(window.URL.createObjectURL(file));
    } catch (exc) {
      Swal.fire({
        title: 'Προβολή Αρχείου',
        text: 'Δεν έχετε επιλέξει αρχείο προς ανέβασμα.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });
    }
  }

  onSubmitFile(fileParam: string, type: string) {
    try {
      console.log(fileParam);
      let formGroup = this.filesUploadFormGroup;
      const filename = formGroup.get(fileParam)?.value._fileNames;

      if (filename?.length > 100) {
        // Utils.onFileLengthError();
        alert("Μεγάλο όνομα αρχείου");
        return;
      }
      const file = this.uploadFile(formGroup.get(fileParam)?.value);

      this.studentsService.updateStudentFile(file, type)
        .subscribe((res: any) => {
          console.log(res);
          if (res.message == 'FILE ADDED') {
            this.filesSubmitted[fileParam] = true;
            console.log(this.filesSubmitted[fileParam]);
            // Utils.onFileUpload();
          }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Ανέβασμα Αρχείου',
        text: 'Δεν έχετε επιλέξει αρχείο. Παρακαλώ πατήστε στην αναζήτηση και επιλέξτε το αρχείο που επιθυμείτε να ανεβάσετε.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });
    }
  }

  // onSubmitApplicationData(data: any, filesSubmitted: any) {
  //   this.studentsService.updateStudentSpecialData(data, filesSubmitted);
  // }

  validateFiles(formFileName: string) {
    //this.filesSubmitted[formFileName] = false;
    let formGroup = this.filesUploadFormGroup;
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

  updateFiles() {
    throw Error('not implemeted');
  }
}
