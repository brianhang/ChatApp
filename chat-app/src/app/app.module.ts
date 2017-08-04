import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { ChatService } from './chat/chat.service';
import { MessageComponent } from './message/message.component';
import { UserComponent } from './user/user.component';
import { UserlistComponent } from './userlist/userlist.component';
import { RoomComponent } from './room/room.component';
import { SideoptionsComponent } from './sideoptions/sideoptions.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomListItemComponent } from './room/room-list/room-list-item/room-list-item.component';
import { RoomService } from './room/room.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RoomPipe } from './room/room-list/room-list-item/room-list-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    UserComponent,
    UserlistComponent,
    RoomComponent,
    SideoptionsComponent,
    SettingsComponent,
    SettingsModalComponent,
    RoomListComponent,
    RoomListItemComponent,
    SidebarComponent,
    RoomPipe
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    NgbModule
  ],
  providers: [
    ChatService,
    RoomService
  ],
  entryComponents: [
    SettingsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
