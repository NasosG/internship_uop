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
  // Global variables
  public workBeforeInternship = Utils.workBeforeInternship;
  public unemployedOption = Utils.unemployedOption;
  public privateSecOptions = Utils.privateSecOptions;
  public publicSecOptions = Utils.publicSecOptions;
  // A4.1 option can be found on the html
  public jobRelationOtherThanAbove = Utils.jobRelationOtherThanAbove;
  public specialJobOptions = Utils.specialJobOptions;
  public educationOptions = Utils.educationOptions;
  public educationalStandardOptions = Utils.educationalStandardOptions;
  public demographicsOptions = Utils.demographicsOptions;
  // YES/NO options for the form and pre-selected fields
  public selectedYESOption: number = 1;
  public selectedNOOption: number = 0;

  override ngOnInit(): void {
    this.studentsService.getStudentEntrySheets()
      .subscribe((forms: EntryForm[]) => {
        this.entries = forms;
      });
  }

}
