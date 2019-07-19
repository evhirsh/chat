import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable,of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

loginData = { username:'', password:'' };
message = '';
data: any;

  ngOnInit() {
  }

  
  login() {
    this.http.post('/api/signin',this.loginData).toPromise().then(resp => {
      this.data = resp;
      console.log("in logon");
      localStorage.setItem('jwtToken', this.data.token);
      this.router.navigate(['chat']);
    }, err => {
      this.message = err.error.msg;
      })
    }
}
