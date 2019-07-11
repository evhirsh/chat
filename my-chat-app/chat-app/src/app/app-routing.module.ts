import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';


const approutes: Routes = [
  {
    path: 'groups',
    component: GroupComponent,
    data: { title: 'Chat Rooms List' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Sign Up' }
  },
  {
    path: 'chat',
    component: ChatRoomComponent,
    data: {data :'chat'}
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
