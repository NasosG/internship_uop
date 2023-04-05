import { Component, Input, OnInit } from '@angular/core';
import {Utils} from 'src/app/MiscUtils';
import { ExitForm } from '../exit-form.model';
import { SheetOutputComponent } from '../sheet-output/sheet-output.component';
import {Student} from '../student.model';

@Component({
  selector: 'app-sheet-output-preview',
  templateUrl: './sheet-output-preview.component.html',
  styleUrls: ['./sheet-output-preview.component.css']
})
export class SheetOutputPreviewComponent extends SheetOutputComponent implements OnInit {
  public exitForms: ExitForm[] = [];
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
  @Input() studentData!: Student[];
  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');

  override ngOnInit(): void {
    this.studentsService.getStudentExitSheets()
      .subscribe((forms: ExitForm[]) => {
        this.exitForms = forms;
        const creationDate = this.exitForms[0].creation_date ? Utils.getAtlasPreferredTimestamp(this.exitForms[0].creation_date) : this.currentDate;
        this.currentDate = creationDate;
      });
  }

}
