import { Component, OnInit } from '@angular/core';
import {ExitForm} from '../exit-form.model';
import {SheetOutputComponent} from '../sheet-output/sheet-output.component';

@Component({
  selector: 'app-sheet-output-preview',
  templateUrl: './sheet-output-preview.component.html',
  styleUrls: ['./sheet-output-preview.component.css']
})
export class SheetOutputPreviewComponent extends SheetOutputComponent implements OnInit {
  public entryForms: ExitForm[] = [];

  override ngOnInit(): void {
    this.studentsService.getStudentExitSheets()
      .subscribe((forms: ExitForm[]) => {
        this.entryForms = forms;
      });
  }
}
