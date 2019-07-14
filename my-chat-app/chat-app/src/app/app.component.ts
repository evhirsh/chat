import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-app';
  isLogin = localStorage.getItem('jwtToken') ? true:false;
  constructor( private router: Router) { 
    console.log(localStorage.getItem('jwtToken') ? true:false)
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

}
