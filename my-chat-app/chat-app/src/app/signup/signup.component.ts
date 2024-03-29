import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable,of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  signupData = { username:'', password:'' };
  message = '';

  ngOnInit() {
  }

  signup() {
    this.http.post('/api/signup',this.signupData).toPromise().then(resp => {
      console.log("in sign up",resp);
      this.router.navigate(['login']);
    }, err => {
      this.message = err.error.msg;
    });
  }
}
