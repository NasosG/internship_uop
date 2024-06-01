import { Component, Input, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { SheetInputComponent } from '../sheet-input/sheet-input.component';
import { EntryForm } from '../entry-form.model';
import { Student } from '../student.model';

@Component({
  selector: 'app-sheet-input-preview',
  templateUrl: './sheet-input-preview.component.html',
  styleUrls: ['./sheet-input-preview.component.css']
})
export class SheetInputPreviewComponent extends SheetInputComponent implements OnInit {
  // Details of the student used in printing the input sheet
  @Input() studentData!: Student[];

  public entryForms: EntryForm[] = [];

  // Global variables

  // MIS 2021-2027
  public WorkOptionsMIS2127 = Utils.WorkOptionsMIS2127;
  public educationOptionsMIS2127 = Utils.educationOptionsMIS2127;
  public demographicsOptionsMIS2127 = Utils.demographicsOptionsMIS2127;

  // MIS 2014-2020
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

  // Other component properties
  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
  // Flag to indicate whether the student's contract is in the old MIS (before 2023) or not
  public isContractOld: boolean = false;

  public isMisNew(): boolean {
    const q = new Date();
    const m = q.getMonth() + 1;
    const d = q.getDay();
    const y = q.getFullYear();

    const currentDate = new Date(y, m, d);

    const comparisonDate = new Date('2024-01-01');
    return currentDate >= comparisonDate;
  }

  override ngOnInit(): void {
    this.studentsService.getStudentEntrySheets()
      .subscribe((forms: EntryForm[]) => {
        this.entryForms = forms;
        console.log(this.entryForms);
        const creationDate = this.entryForms[0].creation_date ? Utils.getAtlasPreferredTimestamp(this.entryForms[0].creation_date) : this.currentDate;
        this.currentDate = creationDate;

        // Service call to check contract status
        this.studentsService.getStudentContractStatus().subscribe({
            next: result => {
              console.log('Contract Status:', result);
              this.isContractOld = result;
            },
            error: error => {
              console.error('Error:', error);
            }
          });

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
