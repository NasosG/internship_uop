import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyEvaluationForm } from '../company-evaluation-form.model';
import Swal from 'sweetalert2';
import {CompanyService} from '../company.service';

@Component({
  selector: 'app-company-evaluation-dialog',
  templateUrl: './company-evaluation-dialog.component.html',
  styleUrls: ['./company-evaluation-dialog.component.css']
})
export class CompanyEvaluationDialogComponent implements OnInit {
  entries!: CompanyEvaluationForm;

  public companyEvaluation = [
    { subCategory: '1', id: 'q1', name: 'q1', text: 'Σε ποιο βαθμό προσέφερε η Πρακτική Άσκηση ανατροφοδότηση στο φορέα σας; ' },

    { subCategory: '2', id: 'q2', name: 'q2', text: 'Είστε ικανοποιημένος από τη συνεργασία με τους υπευθύνους της Πρακτικής Άσκησης;' },
    { subCategory: '3', id: 'q3', name: 'q3', text: 'Είστε ικανοποιημένος από το σχεδιασμό του προγράμματος της Πρακτικής Άσκησης;' },
    { subCategory: '4', id: 'q4', name: 'q4', text: 'Σκοπεύετε να επαναλάβετε τη συνεργασία σας με το Πανεπιστήμιο Πελοποννήσου στο πλαίσιο της Πρακτικής Άσκησης;' },
  ];

  public questionsAboutStudent = [
    { subCategory: '5', id: 'q5', name: 'q5', text: 'Θεωρείτε ότι ο φοιτητής είχε την κατάλληλη εκπαίδευση ώστε να ανταποκριθεί στις ανάγκες των εργασιών που ανατέθηκαν; ' },
    { subCategory: '6', id: 'q6', name: 'q6', text: 'Θεωρείτε ότι η πρακτική άσκηση βοήθησε το φοιτητή να αποκτήσει νέες τεχνικές γνώσεις και δεξιότητες;' },
    { subCategory: '7', id: 'q7', name: 'q7', text: 'Θεωρείτε ότι η πρακτική άσκηση ήταν σημαντική για τον φοιτητή και θα τον βοηθήσει στην εξεύρεση εργασιας;' },
    { subCategory: '8', id: 'q8', name: 'q8', text: 'Μείνατε ικανοποιημένοι από την απόδοση του φοιτητή;' },
  ]

  public companyEvaluateStudent = [
    { subCategory: '9', id: 'q9', name: 'q9', text: 'Τεχνική κατάρτιση στο αντικείμενο της θέσης' },
    { subCategory: '10', id: 'q10', name: 'q10', text: 'Ευκολία ενσωμάτωσης στο περιβάλλον εργασίας' },
    { subCategory: '11', id: 'q11', name: 'q11', text: 'Μαθησιακή ικανότητα / ενδιαφέρον' },
    { subCategory: '12', id: 'q12', name: 'q12', text: 'Ηγετική ικανότητα και λήψη πρωτοβουλιών' },
    { subCategory: '13', id: 'q13', name: 'q13', text: 'Ικανότητα προφορικής / γραπτής επικοινωνίας' },
    { subCategory: '14', id: 'q14', name: 'q14', text: 'Τήρηση δεοντολογίας, εργατικότητα, τήρηση ωραρίου' },
    { subCategory: '15', id: 'q15', name: 'q15', text: 'Συνεισφορά σε ατομικό και ομαδικό επίπεδο' }
  ]

  public companyEvaluationOptions = [
    { subCategory: '16', id: 'q16', name: 'q16', text: 'Πιστεύετε ότι η Πρακτική Άσκηση συνέβαλε' }
  ]

  public companyEvaluationText = [
    { subCategory: '17', id: 'comments', name: 'comments', text: 'Γενικά Σχόλια' },
  ];

  public isEditEnabled = true;
  studentsData: any;
  studentName!: string;

  getDisplayValue(value: number | string) {

    if (typeof value != 'number') {
      return value;
    }

    const valuesToDisplay = ['ΑΝΕΠΑΡΚΩΣ', 'ΜΕΤΡΙΑ', 'ΚΑΛΑ', 'ΠΟΛΥ ΚΑΛΑ'];

    if (value >= 1 && value <= 4) {
      return valuesToDisplay[value - 1];
    }

    return value.toString();
  }

  printEvaluationSheet() {
  let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
  const printContent = document.getElementById("evaluationSheetPreviewContent");
  this.studentName = 'billy kuriakopoulos';
  const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');

  const printResults = (results: any[]) => {
    return results.map(result => `<tr><td>${result.text}</td><td style="text-align: center;">${this.getDisplayValue(result.value)}</td></tr>`).join('');
  };

  const allResults = [
    ...this.companyEvaluation,
    ...this.questionsAboutStudent,
    ...this.companyEvaluateStudent,
    ...this.companyEvaluationOptions,
    ...this.companyEvaluationText
  ].map(result => ({ ...result, value: (this.entries as any)[result.name] }));

  const resultsTable = `
    <table>
      <thead>
        <tr>
          <th>Ερώτηση</th>
          <th>Απάντηση</th>
        </tr>
      </thead>
      <tbody>
        ${printResults(allResults)}
      </tbody>
    </table>`;

  windowPrint?.document.write((printContent?.innerHTML == null) ? '' : printContent?.innerHTML);
  windowPrint?.document.write("<h5 style='text-align: left;'>ΑΞΙΟΛΟΓΗΣΗ ΦΟΙΤΗΤΗ</h5>");
  windowPrint?.document.write(`<p style='text-align: left;'> Ημ. Εκτύπωσης: ${currentDate}</p>`);
  windowPrint?.document.write(`<p style='text-align: left;'><strong>Φοιτητής:</strong> ${this.data.studentName}</p>`);
  windowPrint?.document.write(`<p style='text-align: left;'><strong>Θέση φοιτητή:</strong> ${this.data.positionTitle}</p>`);

  windowPrint?.document.write(resultsTable);
  windowPrint?.document.close();
  windowPrint?.focus();
  windowPrint?.print();
  windowPrint?.close();
}

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    private companyService: CompanyService,
    public dialogRef: MatDialogRef<CompanyEvaluationDialogComponent>
  ) { }

  ngOnInit(): void {
    this.companyService.getCompanysEvaluationForm(this.data.studentId, this.data.positionId)
      .subscribe((responseData:any) => {
        console.log(responseData);
        if (!responseData?.message)
        this.entries = responseData;
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmitCompanyEvaluationSheet(formData: FormData) {
    this.onSaveEvaluationSheetSwal(formData);
  }

  public onSaveEvaluationSheetSwal(formData: FormData) {
    Swal.fire({
      title: 'Αξιολόγηση πρακτικής άσκησης',
      text: 'Είστε σίγουροι ότι θέλετε να καταχωρήσετε την αξιολόγηση;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.insertStudentEvaluationSheet(this.data.studentId, this.data.positionId, formData);
        Swal.fire({
          title: 'Επιτυχής καταχώρηση',
          text: 'Πηγαίνετε στη καρτέλα "Προβολή" για να δείτε και να εκτυπώσετε την αξιολόγηση σας.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then(() => { location.reload(); });
      }
    });
  }

}
