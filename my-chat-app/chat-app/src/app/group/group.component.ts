import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable,of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ChatService } from '../chat.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

// declare var $ : any;
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})


export class GroupComponent implements OnInit {

  constructor(private router: Router,private chatService : ChatService) { }
  
  isLogin ;

  message='';
  isGnameValid =false;
  isdecChanged =false;
  editInputGname ='';
  editDescInput ='';
  reference = {descBeforeCange:"",GnameBeforeCange:""};
  editGid;
  groups$ = this.chatService.gruopList$;
  httpOptions;
  ngOnInit() {
    this.isLogin = localStorage.getItem('jwtToken') ? true:false;

    if (this.isLogin) {
      this.httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken'),'Content-Type':'application/json','Cache-Control': 'no-cache' })
      };
     this.chatService.getGroups(this.httpOptions);
     this.chatService.gruopList$.subscribe(list => this.groups$ =list);
    }else{
      this.router.navigate(['login']);
    }
   
   }

   checkValid(text){
     console.log('change')
     if(text.length >3){
       this.isGnameValid=true;
     }else{
      this.isGnameValid=false;
     }
   }

   checkIfdecChanged(){
     if (!this.isdecChanged) {
       console.log('desc cahnged')
       this.isdecChanged =true;
     }
   }
   
   openEditModal(gid){
     this.chatService.getSpecificGroup(gid,this.httpOptions).then(data =>{
        this.editDescInput = data.description;
        this.editInputGname = data.name;
        this.reference.descBeforeCange = this.editDescInput;
        this.reference.GnameBeforeCange = this.editInputGname;
        this.editGid = data._id;
        this.isGnameValid=true
     }).catch(err => {
      console.log('specific g errrrrrrr',err.error.msg)
      this.message = err.error.msg;
     })
   }

   clearModal(){
     console.log("in clear modal")
    this.editDescInput = '';
    this.editInputGname = '';
   }
   addNewGroup(name1,desc){
    console.log(name1);
    this.chatService.addNewGroup({name:name1,description:desc},this.httpOptions).catch(err => {
      console.log('addGroup errrrrrrr',err.error.msg)
      this.message = err.error.msg;
      this.editDescInput=''
    })
   }

   removeGroup(groupName){
    console.log('gname-----',groupName)
    // this.chatService.removeGroup(groupName,this.httpOptions)
    this.chatService.removeGroup(groupName,this.httpOptions).catch(err => {
        console.log('errrrrrrrrrr',err.error.msg)
        this.message = err.error.msg;
      })
    }
    updateGroup(gname,desc,gid){
      let g ={
        name:gname,
        description:desc,
        id : gid
      }
      if (  (gname != this.reference.GnameBeforeCange) || (desc != this.reference.descBeforeCange) ) {
          this.chatService.updateGroup(g,this.httpOptions).catch(err => {
            console.log('errrrrrrrrrr in update ',err.error.msg)
            this.message = err.error.msg;
          })
      }
    } 
}
