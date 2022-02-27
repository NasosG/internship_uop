import { Component, OnInit } from '@angular/core';
import {ExitForm} from '../exit-form.model';
import {SheetOutputComponent} from '../sheet-output/sheet-output.component';

@Component({
  selector: 'app-sheet-output-edit',
  templateUrl: './sheet-output-edit.component.html',
  styleUrls: ['./sheet-output-edit.component.css']
})
export class SheetOutputEditComponent extends SheetOutputComponent implements OnInit {
  entries!: ExitForm[];

  override ngOnInit(): void {
    this.studentsService.getStudentExitSheets()
      .subscribe((forms: ExitForm[]) => {
        this.entries = forms;
      });
  }
}
