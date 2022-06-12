import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Company } from '../../companies/company.model';
import { CompanyService } from '../../companies/company.service';
import {CompanySelectionDialogComponent} from '../company-selection-dialog/company-selection-dialog.component';


@Component({
  selector: 'app-credentials-generic-signup',
  templateUrl: './credentials-generic-signup.component.html',
  styleUrls: ['./credentials-generic-signup.component.css']
})
export class CredentialsGenericSignupComponent implements OnInit {
  @ViewChild('AFMInput') afmInput!: ElementRef;
  companiesArray: Company[] = [];
  companiesArrayTemp: Company[] = [];

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
          this.companiesArrayTemp = providers;
          console.log('Multiple companies with the same AFM detected')
          this.openDialog(providers);
        }
        console.log(this.companiesArray);
      });
  }

  onSubmitCompanyDetails(val: any) {

  }

  openDialog(data: Company[]) {
    const dialogRef = this.dialog.open(CompanySelectionDialogComponent, {
      // width: '350px',
      data: { providers: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.companiesArray = [];
      this.companiesArray[0] = this.companiesArrayTemp[result];
    });
  }

}
