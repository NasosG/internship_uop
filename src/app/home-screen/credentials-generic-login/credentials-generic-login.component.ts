import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-credentials-generic-login',
  templateUrl: './credentials-generic-login.component.html',
  styleUrls: ['./credentials-generic-login.component.css']
})

export class CredentialsGenericLoginComponent implements OnInit {
  @ViewChild('username') usernameInput!: ElementRef;
  @ViewChild('password') passwordInput!: ElementRef;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
  }

  rememberMe() {}

  passwordToggle() {
    const inputPassword = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword')!;
    let passwordType = inputPassword?.getAttribute('type');

    const type = passwordType === 'password' ? 'text' : 'password';
    inputPassword?.setAttribute('type', type);
    // toggle the eye / eye slash icon
    togglePasswordBtn.classList?.toggle('fa-eye-slash');
  }

  login() {
    this.authService.loginWithPassword(this.usernameInput?.nativeElement.value, this.passwordInput?.nativeElement.value);
  }
}
