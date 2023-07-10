import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { ExitForm } from '../exit-form.model';
import { SheetOutputComponent } from '../sheet-output/sheet-output.component';

@Component({
  selector: 'app-sheet-output-edit',
  templateUrl: './sheet-output-edit.component.html',
  styleUrls: ['./sheet-output-edit.component.css']
})
export class SheetOutputEditComponent extends SheetOutputComponent implements OnInit {
  entries!: ExitForm[];
  // Global variables
  public unemployedOptionOutputSheet = Utils.unemployedOptionOutputSheet;
  public workingOptionsOutputSheet = Utils.workingOptionsOutputSheet;
  public privateSecOptionsOutputSheet = Utils.privateSecOptionsOutputSheet;
  public publicSecOptionsOutputSheet = Utils.publicSecOptionsOutputSheet;
  public selfEmployedOutputSheet = Utils.selfEmployedOutputSheet;
  public jobRelationOtherThanAboveOutputSheet = Utils.jobRelationOtherThanAboveOutputSheet;
  public specialJobOptionsOutputSheet = Utils.specialJobOptionsOutputSheet;
  public internshipExperienceOutputSheet = Utils.internshipExperienceOutputSheet;
  public educationOptionsOutputSheet = Utils.educationOptionsOutputSheet;
  // YES/NO options for the form and pre-selected fields
  public selectedYESOption: number = 1;
  public selectedNOOption: number = 0;
  public optionValue: number | null = null;

  override ngOnInit(): void {
    this.studentsService.getStudentExitSheets()
      .subscribe({
        next: (forms: ExitForm[]) => {
          this.entries = forms;
        },
        error: (error: any) => {
          console.error(error);
          const errorMessage = "Σφάλμα κατά τη φόρτωση του δελτίου. Προσπαθήστε ξανά.";
          Utils.displayErrorSwal(errorMessage);
        }
      });
  }
}
