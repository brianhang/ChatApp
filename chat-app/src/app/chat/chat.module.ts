import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { LoaderModule } from '../common/loader/loader.module';
import { MarkdownModule } from 'angular2-markdown';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ChatService } from './chat/chat.service';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';
import { TypingService } from './typing/typing.service';
import { NotifyService } from './notify/notify.service';
import { BanService } from './room/room-bans/ban.service';

import { ChatComponent } from './chat.component';
import { MessageComponent } from './message/message.component';
import { UserComponent } from './user/user.component';
import { RoomComponent } from './room/room.component';
import { SideoptionsComponent } from './sideoptions/sideoptions.component';
import { SettingsComponent } from './settings/settings.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomListItemComponent } from './room/room-list/room-list-item/room-list-item.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RoomAddButtonComponent } from './room/room-add-button/room-add-button.component';
import { RoomAddFormComponent } from './room/room-add-form/room-add-form.component';
import { RoomEditButtonComponent } from './room/room-edit-button/room-edit-button.component';
import { RoomEditFormComponent } from './room/room-edit-form/room-edit-form.component';
import { RoomPasswordFormComponent } from './room/room-password-form/room-password-form.component';
import { NotifyComponent } from './notify/notify.component';
import { RoomPasswordFormService } from './room/room-password-form/room-password-form.service';
import { RoomBansComponent } from './room/room-bans/room-bans.component';

import { RoomPipe } from './room/room.pipe';
import { TimeAgoPipe } from 'time-ago-pipe';
import { NgxAutoScrollModule } from './ngx-auto-scroll/ngx-auto-scroll.module';

@NgModule({
  declarations: [
    ChatComponent,
    RoomPipe,
    MessageComponent,
    UserComponent,
    RoomComponent,
    SideoptionsComponent,
    SettingsComponent,
    RoomListComponent,
    RoomListItemComponent,
    SidebarComponent,
    TimeAgoPipe,
    RoomAddButtonComponent,
    RoomAddFormComponent,
    RoomEditButtonComponent,
    RoomEditFormComponent,
    RoomPasswordFormComponent,
    NotifyComponent,
    RoomBansComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    NgbModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToasterModule,
    LoaderModule,
    NgxAutoScrollModule
  ],
  exports: [
    ReactiveFormsModule
  ],
  providers: [
    ChatService,
    RoomService,
    MessageService,
    RoomPipe,
    TypingService,
    RoomPasswordFormService,
    NotifyService,
    BanService
  ],
  entryComponents: [
    SettingsComponent,
    RoomAddFormComponent,
    RoomEditFormComponent,
    RoomPasswordFormComponent
  ]
})
export class ChatModule { }
