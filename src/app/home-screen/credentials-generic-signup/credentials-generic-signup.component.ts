import {HttpErrorResponse} from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';
import { Company } from '../../companies/company.model';
import { CompanyService } from '../../companies/company.service';
import { CompanySelectionDialogComponent } from '../company-selection-dialog/company-selection-dialog.component';


@Component({
  selector: 'app-credentials-generic-signup',
  templateUrl: './credentials-generic-signup.component.html',
  styleUrls: ['./credentials-generic-signup.component.css']
})
export class CredentialsGenericSignupComponent implements OnInit {
  @ViewChild('AFMInput') afmInput!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('repeatPassword') repeatPassword!: ElementRef;

  isLoading: boolean = false;
  passwordsNotMatch: string = "";
  companiesArray: Company[] = [];
  companiesArrayTemp: Company[] = [];

  constructor(public companyService: CompanyService, public dialog: MatDialog, public authService: AuthService) { }

  ngOnInit(): void { }

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

  onSubmitCompanyDetails(data: any) {
    let passwordsMatch = this.validatePasswords();
    if (!passwordsMatch) return;
    const id = {
      "id": this.companiesArray[0].id
    };
    let allData = Object.assign(data, id);
    console.log(allData);
    this.companyService.insertCompany(allData)
    .subscribe(responseData => {
        this.isLoading = true;
        console.log(responseData.message);
        this.authService.loginWithPassword(allData.username, allData.password);
      },
      (error: HttpErrorResponse) => {
        // Handle error
        console.log("error");
        this.onError();
    });
  }

  //check if passwords are the same
  checkIfPasswordsMatch() {
    if (this.password?.nativeElement.value == this.repeatPassword?.nativeElement.value) {
        this.passwordsNotMatch = "";
    } else {
        this.passwordsNotMatch = "GENERIC.PASSWORDS-NOT-MATCH";
    }
  }

  validatePasswords() {
    if (this.passwordsNotMatch != null && this.passwordsNotMatch != "") {
      alert("Passwords do not match");
      return false;
    }
    return true;
  }

  onError() {
    Swal.fire({
      title: 'Σφάλμα',
      text: 'Το username χρησιμοποείται ήδη',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
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
      console.log(this.companiesArray[0]);
    });
  }

}
