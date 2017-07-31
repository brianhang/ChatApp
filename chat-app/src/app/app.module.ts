import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { ChatService } from './chat/chat.service';
import { MessageComponent } from './message/message.component';
import { UserComponent } from './user/user.component';
import { UserlistComponent } from './userlist/userlist.component';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { RoomComponent } from './room/room.component';
import { SideoptionsComponent } from './sideoptions/sideoptions.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    UserComponent,
    UserlistComponent,
    RoomlistComponent,
    RoomComponent,
    SideoptionsComponent,
    SettingsComponent,
    SettingsModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    NgbModule
  ],
  providers: [
    ChatService
  ],
  entryComponents: [
    SettingsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
