import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credentials-generic-login',
  templateUrl: './credentials-generic-login.component.html',
  styleUrls: ['./credentials-generic-login.component.css']
})

export class CredentialsGenericLoginComponent implements OnInit {
  
  constructor() {}

  ngOnInit(): void {
  }
  
  passwordToggle() {
    const checkbox = document.getElementById('pswd_show')!;
    this.toggle(checkbox);
  }
rememberMe(){}
  toggle(checkbox: HTMLElement) {    
    const element = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword')!;
    let passwordType = element?.getAttribute('type');
    
    const type = passwordType === 'password' ? 'text' : 'password';
    element?.setAttribute('type', type);
    // toggle the eye / eye slash icon
    togglePasswordBtn.classList?.toggle('fa-eye-slash');
  }
}
