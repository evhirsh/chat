import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import  { ChatService } from '../chat.service' 

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [ChatService]
})
export class ChatRoomComponent implements OnInit {

    messages$ = this.chatService.messagesList$;
    groups$ = this.chatService.gruopList$;
    httpOptions;

  ngOnInit() {
    this.httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken'),'Content-Type':'application/json','Cache-Control': 'no-cache' })
      };
    //   this.chatService.getuser
     this.chatService.messagesList$.subscribe(list => this.messages$ =list);
     this.chatService.getGroups(this.httpOptions);
   this.chatService.gruopList$.subscribe(list => this.groups$ =list);
  }

  user:String;
  room:String;
  messageText:String;
  messageArray:Array<{user:String,message:String}> = [];
  constructor(private chatService:ChatService){
      this.chatService.newUserJoined()
      .subscribe(data=> this.messageArray.push(data));


      this.chatService.userLeftRoom()
      .subscribe(data=>this.messageArray.push(data));

      this.chatService.newMessageReceived()
      .subscribe(data=>this.messageArray.push(data));
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
  }

  changeMessageArea(room){
      this.messageArray=[];
      this.chatService.getRoomMessages(room,this.httpOptions)
      .then(() => this.chatService.switchRooms(room)).catch(err =>{
          alert('Error occured ,could not load messages\n try to switch rooms again');
      })
  }


}
