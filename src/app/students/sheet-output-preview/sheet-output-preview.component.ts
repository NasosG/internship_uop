import { Component, OnInit } from '@angular/core';
import {Utils} from 'src/app/MiscUtils';
import { ExitForm } from '../exit-form.model';
import { SheetOutputComponent } from '../sheet-output/sheet-output.component';

@Component({
  selector: 'app-sheet-output-preview',
  templateUrl: './sheet-output-preview.component.html',
  styleUrls: ['./sheet-output-preview.component.css']
})
export class SheetOutputPreviewComponent extends SheetOutputComponent implements OnInit {
  public exitForms: ExitForm[] = [];
  // Global variables
  public unemployedOptionOutputSheet = Utils.unemployedOptionOutputSheet;
  public privateSecOptionsOutputSheet = Utils.privateSecOptionsOutputSheet;
  public publicSecOptionsOutputSheet = Utils.publicSecOptionsOutputSheet;
  public selfEmployedOutputSheet = Utils.selfEmployedOutputSheet;
  public jobDetailsOutputSheet = Utils.jobDetailsOutputSheet;
  public internshipExperienceOutputSheet = Utils.internshipExperienceOutputSheet;

  override ngOnInit(): void {
    this.studentsService.getStudentExitSheets()
      .subscribe((forms: ExitForm[]) => {
        this.exitForms = forms;
      });
  }

}
