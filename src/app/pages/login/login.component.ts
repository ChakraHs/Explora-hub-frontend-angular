import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login=true
  constructor() {}

  navigate=()=>{
    this.login= !this.login
  }
}
