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

  toggle(checkbox: HTMLElement) {
    let isChecked = (<HTMLInputElement>checkbox).checked;
    const element = document.getElementById('exampleInputPassword1');
    if (isChecked) {
      element?.setAttribute('type', 'text');
      // checkbox.innerHTML = 'hide';
    } else {
      element?.setAttribute('type', 'password');
      // checkbox.innerHTML = 'show';
    }
  }
}
