import { Component, Input, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { ExitForm } from '../exit-form.model';
import { SheetOutputComponent } from '../sheet-output/sheet-output.component';
import { Student } from '../student.model';

@Component({
  selector: 'app-sheet-output-preview',
  templateUrl: './sheet-output-preview.component.html',
  styleUrls: ['./sheet-output-preview.component.css']
})
export class SheetOutputPreviewComponent extends SheetOutputComponent implements OnInit {
  // Input property to receive student data from the parent component
  @Input() studentData!: Student[];

  // Model data for exit forms
  public exitForms: ExitForm[] = [];

  // Global variables

  // MIS 2021-2027
  public workOptionsOutputSheetMIS2127 = Utils.workOptionsOutputSheetMIS2127;
  public educationOptionsOutputSheetMIS2127 = Utils.educationOptionsOutputSheetMIS2127;
  public internshipExperienceOutputSheetMIS2127 = Utils.internshipExperienceOutputSheetMIS2127;
  // Old MIS
  public unemployedOptionOutputSheet = Utils.unemployedOptionOutputSheet;
  public workingOptionsOutputSheet = Utils.workingOptionsOutputSheet;
  public privateSecOptionsOutputSheet = Utils.privateSecOptionsOutputSheet;
  public publicSecOptionsOutputSheet = Utils.publicSecOptionsOutputSheet;
  public selfEmployedOutputSheet = Utils.selfEmployedOutputSheet;
  public jobRelationOtherThanAboveOutputSheet = Utils.jobRelationOtherThanAboveOutputSheet;
  public specialJobOptionsOutputSheet = Utils.specialJobOptionsOutputSheet;
  public internshipExperienceOutputSheet = Utils.internshipExperienceOutputSheet;
  public educationOptionsOutputSheet = Utils.educationOptionsOutputSheet;

  // Other component properties
  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
  // Flag to indicate whether the student's contract is in the old MIS (before 2023) or not
  public isContractOld: boolean = false;

  override ngOnInit(): void {
    this.studentsService.getStudentExitSheets()
      .subscribe((forms: ExitForm[]) => {
        this.exitForms = forms;
        const creationDate = this.exitForms[0].creation_date ? Utils.getAtlasPreferredTimestamp(this.exitForms[0].creation_date) : this.currentDate;
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

  public isMisNew(): boolean {
    const q = new Date();
    const m = q.getMonth() + 1;
    const d = q.getDay();
    const y = q.getFullYear();

    const currentDate = new Date(y, m, d);

    const comparisonDate = new Date('2024-01-01');
    return currentDate >= comparisonDate;
  }

}
