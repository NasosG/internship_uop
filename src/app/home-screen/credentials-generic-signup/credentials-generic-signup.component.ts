import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credentials-generic-signup',
  templateUrl: './credentials-generic-signup.component.html',
  styleUrls: ['./credentials-generic-signup.component.css']
})
export class CredentialsGenericSignupComponent implements OnInit {

  constructor() { }

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

}
