import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credentials-generic-login',
  templateUrl: './credentials-generic-login.component.html',
  styleUrls: ['./credentials-generic-login.component.css']
})

export class CredentialsGenericLoginComponent implements OnInit {
  @ViewChild('username') usernameInput!: ElementRef;
  @ViewChild('password') passwordInput!: ElementRef;
  isLoading: boolean = false;
  shown: boolean = false;
  color: string = 'accent';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    // if (!this.authService.getIsAuthenticated()) {
    //   this.onSave();
    // }
  }

  rememberMe() { }

  passwordToggle() {
    const inputPassword = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword')!;
    let passwordType = inputPassword?.getAttribute('type');

    const type = passwordType === 'password' ? 'text' : 'password';
    inputPassword?.setAttribute('type', type);
    // toggle the eye / eye slash icon
    togglePasswordBtn.classList?.toggle('fa-eye-slash');
  }

  onSave() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Έκανες λάθος',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  login() {
    this.isLoading = true;
    this.authService.loginWithPassword(this.usernameInput?.nativeElement.value, this.passwordInput?.nativeElement.value);
  }

  submitOnEnter() {
    this.login();
  }
}
