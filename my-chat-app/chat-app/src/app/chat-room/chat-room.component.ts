import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import  { ChatService } from '../chat.service' 
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [ChatService]
})
export class ChatRoomComponent implements OnInit {

  isLogin;

    messages$ = this.chatService.messagesList$;
    groups$ = this.chatService.gruopList$;
    httpOptions;
    user;

  ngOnInit() {
    this.isLogin = localStorage.getItem('jwtToken') ? true:false;

    if(this.isLogin){
    this.httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken'),'Content-Type':'application/json','Cache-Control': 'no-cache' })
      };
      this.chatService.getUsername(this.httpOptions).then((data:any) => {this.user= data.user;console.log('user',JSON.stringify(this.user));})
     .catch(err => console.log(err))
     this.chatService.messagesList$.subscribe(list => this.messages$ =list);
     this.chatService.getGroups(this.httpOptions);
     this.chatService.gruopList$.subscribe(list => this.groups$ =list);
  }else{
    this.router.navigate(['login']);
  }
}

  room:String;
  messageText:String;
  messageArray:Array<{user:String,message:String}> = [];
  someOneTyping=false;
  whoTyping;
  constructor(private chatService:ChatService,private router:Router){
      this.chatService.newUserJoined()
      .subscribe(data=> this.messageArray.push(data));


      this.chatService.userLeftRoom()
      .subscribe(data=>this.messageArray.push(data));

      this.chatService.newMessageReceived()
      .subscribe(data=>this.messageArray.push(data));
     
      this.chatService.typing()
      .subscribe(data=>{
        this.whoTyping=data.message;
        this.someOneTyping=true
      setTimeout(()=>{
        this.someOneTyping=false;
      },2000)});
  }

  join(){
    if(this.room != null){ 
    this.chatService.joinRoom({user:this.user, room:this.room});
    }
  }

  leave(){
    if(this.room != null){ 
        this.chatService.leaveRoom({user:this.user, room:this.room});
        }
      }

  sendMessage()
  {
      this.chatService.sendMessage({user:this.user, room:this.room, message:this.messageText},this.httpOptions);
      this.messageText = '';
  }

  changeMessageArea(room){
      this.messageArray=[];
      this.chatService.getRoomMessages(room,this.httpOptions)
      .then(() => this.chatService.switchRooms(room)).catch(err =>{
          alert('Error occured ,could not load messages\n try to switch rooms again');
      })
  }

  isTyping(){
    console.log('in here');
    this.chatService.isTyping(this.user);
  }


}
