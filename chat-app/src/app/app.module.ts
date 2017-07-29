import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ChatService } from './chat/chat.service';
import { MessageComponent } from './message/message.component';
import { UserComponent } from './user/user.component';
import { UserlistComponent } from './userlist/userlist.component';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { RoomComponent } from './room/room.component';
import { SideoptionsComponent } from './sideoptions/sideoptions.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    UserComponent,
    UserlistComponent,
    RoomlistComponent,
    RoomComponent,
    SideoptionsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
