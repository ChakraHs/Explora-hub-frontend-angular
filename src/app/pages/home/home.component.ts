import { Router } from '@angular/router';
import { Component , OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  homeImage :String = "../../../assets/img/homeExplora.PNG"


constructor(private router: Router) {}

navigateTo( route: string ): void {
  this.router.navigate([ route ]);
}

}
