import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  constructor(public companyService: CompanyService) { }

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
        this.companiesArray = providers;
        console.log(this.companiesArray);
      });
  }

  onSubmitCompanyDetails(val: any) {

  }
}
