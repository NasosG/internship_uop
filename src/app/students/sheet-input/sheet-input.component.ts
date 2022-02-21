import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-sheet-input',
  templateUrl: './sheet-input.component.html',
  styleUrls: ['./sheet-input.component.css']
})
export class SheetInputComponent implements OnInit {

  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void { }

  printInputSheet() {
    const printContent = document.getElementById("inputSheetPreview");
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write( (printContent?.innerHTML==null) ? '' : printContent?.innerHTML );
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }



  onSubmitStudentEntrySheet(formData: FormData) {
    console.log('geia xara')
    console.log(formData);
    this.studentsService.insertStudentEntrySheet(formData);
    alert("eisai ok bro!");
    //this.onSave();
  }

}
