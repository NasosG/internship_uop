import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/companies/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  @ViewChild('email') emailInput!: ElementRef;
  isLoading: boolean = false;

  constructor(public companyService: CompanyService) { }

  ngOnInit(): void { }

  onResetSuccess() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Σας έχει σταλθεί νέος κωδικός πρόσβασης στο email σας!',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  onResetFail() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Λάθος email χρήστη',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  submitResetPassword() {
    // this.isLoading = true;
    this.companyService.resetPassword(this.emailInput?.nativeElement.value)
      .subscribe((response) => {
        if (response.status == 200) {
          this.onResetSuccess();
        }
      }, error => {
          this.onResetFail();
      });
  }

  submitOnEnter() {
    this.submitResetPassword();
  }
}
