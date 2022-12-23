import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { StudentsService } from '../student.service';
import Swal from 'sweetalert2';
import { SheetInputComponent } from '../sheet-input/sheet-input.component';
import { EntryForm } from '../entry-form.model';


@Component({
  selector: 'app-sheet-input-preview',
  templateUrl: './sheet-input-preview.component.html',
  styleUrls: ['./sheet-input-preview.component.css']
})
export class SheetInputPreviewComponent extends SheetInputComponent implements OnInit {

  public entryForms: EntryForm[] = [];

  override ngOnInit(): void {
    this.studentsService.getStudentEntrySheets()
      .subscribe((forms: EntryForm[]) => {
        this.entryForms = forms;
        console.log(this.entryForms);
      });
  }

  unemployedOption = Utils.unemployedOption;
  privateSecOptions = Utils.privateSecOptions;
  publicSecOptions = Utils.publicSecOptions;
  // A4.1 option can be found on the html
  jobRelationOtherThanAbove = Utils.jobRelationOtherThanAbove;
  specialJobOptions = Utils.specialJobOptions;
  educationOptions = Utils.educationOptions;
  educationalStandardOptions = Utils.educationalStandardOptions;
  demographicsOptions = Utils.demographicsOptions;

  override onSubmitStudentEntrySheet(formData: FormData) {
    this.onSaveInputSheetSwal(formData);
  }

}
