import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private groups = new BehaviorSubject([]);
    gruopList$ :Observable<any> =this.groups.asObservable();
    
  constructor(private  http: HttpClient) { }

  getGroups(httpOptions){
    this.http.get('/api/group', httpOptions).toPromise()
    .then( (data : any) => this.groups.next(data))
  }

  getSpecificGroup(gid,httpOptions){
     return  this.http.get(`/api/group/${gid}`,httpOptions).toPromise().then((data:any) =>{
        console.log("in spec then service",data);
        return data;
      }).catch(err => {
        console.log("in get by id throw err");
        throw err
      })
  }

 addNewGroup(groupObj,httpOptions){
    return this.http.post('/api/group',groupObj,httpOptions).toPromise().then(data => {
        console.log("in add then service",data);
        this.getGroups(httpOptions);
    }).catch(err => {console.log("in post throw err");throw err})
 }


  removeGroup(groupName,httpOptions){
   return this.http.delete(`/api/group/${groupName}`,httpOptions)
    .toPromise().then((data:any) => { 
        console.log("in then service",data);
        this.getGroups(httpOptions);
    }).catch(err => {console.log("in throw err");throw err})  
  }

updateGroup(groupObj,httpOptions){
    return this.http.put(`/api/group/${groupObj.id}`,groupObj,httpOptions)
    .toPromise().then((data:any) => { 
        console.log("in then service",data);
        this.getGroups(httpOptions);
    }).catch(err => {console.log("in throw err");throw err})  
}
  
  private socket = io('http://localhost:3000');

    joinRoom(data)
    {
        this.socket.emit('join',data);
    }

    newUserJoined()
    {
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new user joined', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    leaveRoom(data){
        this.socket.emit('leave',data);
    }

    userLeftRoom(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('left room', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    sendMessage(data)
    {
        this.socket.emit('message',data);
    }

    newMessageReceived(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    switchRooms(data){
        this.socket.emit('switchRoom',data);
    }
}

