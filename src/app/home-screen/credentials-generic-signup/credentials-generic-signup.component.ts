import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from '../../companies/company.model';
import { CompanyService } from '../../companies/company.service';


@Component({
  selector: 'app-credentials-generic-signup',
  templateUrl: './credentials-generic-signup.component.html',
  styleUrls: ['./credentials-generic-signup.component.css']
})
export class CredentialsGenericSignupComponent implements OnInit {
  @ViewChild('AFMInput') afmInput!: ElementRef;
  companiesArray: Company[] = [];

  constructor(public companyService: CompanyService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  rememberMe() { }

  passwordToggle(state: string, id: string) {
    const inputPassword = document.getElementById(id);
    const togglePasswordBtn = document.getElementById(state)!;
    let passwordType = inputPassword?.getAttribute('type');

    const type = passwordType === 'password' ? 'text' : 'password';
    inputPassword?.setAttribute('type', type);
    // toggle the eye / eye slash icon
    togglePasswordBtn.classList?.toggle('fa-eye-slash');
  }

  onBlur(): void {
    console.log('Focus Is Lost for this Element');
    let vatRegValue = this.afmInput?.nativeElement.value;
      this.companyService.getCompaniesByAfm(vatRegValue)
      .subscribe((providers: Company[]) => {
        console.log(providers.length);
        if (providers.length == 1) {
          this.companiesArray = providers;
        }
        else if (providers.length > 1) {
          console.log('Multiple companies with the same AFM detected')
          this.openDialog(providers);
        }
        console.log(this.companiesArray);
      });
  }

  onSubmitCompanyDetails(val: any) {

  }

  openDialog(data: Company[]) {
    const dialogRef = this.dialog.open(CompanySelectionDialog, {
      // width: '350px',
      data: { providers: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }


}

@Component({
  selector: 'company-selection-dialog',
  templateUrl: 'company-selection-dialog.html',
  styleUrls: ['company-selection-dialog.css']
})
export class CompanySelectionDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<CompanySelectionDialog>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
