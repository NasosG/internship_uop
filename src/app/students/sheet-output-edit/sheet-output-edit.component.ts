import { Component, OnInit } from '@angular/core';
import {Utils} from 'src/app/MiscUtils';
import {ExitForm} from '../exit-form.model';
import {SheetOutputComponent} from '../sheet-output/sheet-output.component';

@Component({
  selector: 'app-sheet-output-edit',
  templateUrl: './sheet-output-edit.component.html',
  styleUrls: ['./sheet-output-edit.component.css']
})
export class SheetOutputEditComponent extends SheetOutputComponent implements OnInit {
  entries!: ExitForm[];
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
        this.entries = forms;
      });
  }
}
