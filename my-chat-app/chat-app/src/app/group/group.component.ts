import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable,of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  books: any;
  
  ngOnInit() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/group', httpOptions).toPromise().then(data => {
      this.books = data;
      console.log(this.books);
    }, err => {
      if(err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

//   removeGroup(groupName){
//     this.http.put('/api/group', this.httpOptions,groupName).subscribe(data => {
//       this.books = data;
//       console.log(this.books);
//     }, err => {
//       if(err.status === 403) {
//         ;
//       }
//     });
//   }
 }
