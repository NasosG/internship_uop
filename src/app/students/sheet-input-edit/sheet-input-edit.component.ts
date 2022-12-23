import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { EntryForm } from '../entry-form.model';
import { SheetInputComponent } from '../sheet-input/sheet-input.component';

@Component({
  selector: 'app-sheet-input-edit',
  templateUrl: './sheet-input-edit.component.html',
  styleUrls: ['./sheet-input-edit.component.css']
})
export class SheetInputEditComponent extends SheetInputComponent implements OnInit {
  entries!: EntryForm[];

  override ngOnInit(): void {
    this.studentsService.getStudentEntrySheets()
      .subscribe((forms: EntryForm[]) => {
        this.entries = forms;
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

}
