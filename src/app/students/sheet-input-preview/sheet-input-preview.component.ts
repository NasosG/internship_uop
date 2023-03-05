import { Component, Input, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { StudentsService } from '../student.service';
import Swal from 'sweetalert2';
import { SheetInputComponent } from '../sheet-input/sheet-input.component';
import { EntryForm } from '../entry-form.model';
import {Student} from '../student.model';


@Component({
  selector: 'app-sheet-input-preview',
  templateUrl: './sheet-input-preview.component.html',
  styleUrls: ['./sheet-input-preview.component.css']
})
export class SheetInputPreviewComponent extends SheetInputComponent implements OnInit {
  public entryForms: EntryForm[] = [];
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
  // Details of the student used in printing the input sheet
  @Input() studentData!: Student[];

  // public studentName = this.studentsData[0].givenname + " " + this.data.studentsData[0].sn;
  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');

  override ngOnInit(): void {
    this.studentsService.getStudentEntrySheets()
      .subscribe((forms: EntryForm[]) => {
        this.entryForms = forms;
        console.log(this.entryForms);
      });
  }

  override onSubmitStudentEntrySheet(formData: FormData) {
    this.onSaveInputSheetSwal(formData);
  }

  getArrayValueByOptionId(option_id: string): boolean {
    const arrayKey = option_id as keyof EntryForm;
    const value: any = this.entryForms[0][arrayKey];
    if (value === '' || value === 0 || value === undefined || value === null) {
      return false;
    }

    return value;
  }
}
