import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { LoaderModule } from '../common/loader/loader.module';

import { ChatComponent } from './chat.component';
import { ChatService } from './chat/chat.service';
import { MessageComponent } from './message/message.component';
import { UserComponent } from './user/user.component';
import { RoomComponent } from './room/room.component';
import { SideoptionsComponent } from './sideoptions/sideoptions.component';
import { SettingsComponent } from './settings/settings.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomListItemComponent } from './room/room-list/room-list-item/room-list-item.component';
import { RoomService } from './room/room.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MessageService } from './message/message.service';
import { RoomPipe } from './room/room.pipe';
import { NgxAutoScroll } from 'ngx-auto-scroll/lib/ngx-auto-scroll.directive';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';
import { TimeAgoPipe } from 'time-ago-pipe';
import { RoomAddButtonComponent } from './room/room-add-button/room-add-button.component';
import { RoomAddFormComponent } from './room/room-add-form/room-add-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TypingService } from './typing/typing.service';
import { RoomEditButtonComponent } from './room/room-edit-button/room-edit-button.component';
import { RoomEditFormComponent } from './room/room-edit-form/room-edit-form.component';
import { RoomPasswordFormComponent } from './room/room-password-form/room-password-form.component';
import { NotifyService } from './notify/notify.service';
import { NotifyComponent } from './notify/notify.component';

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
    NgxAutoScroll,
    TimeAgoPipe,
    RoomAddButtonComponent,
    RoomAddFormComponent,
    RoomEditButtonComponent,
    RoomEditFormComponent,
    RoomPasswordFormComponent,
    NotifyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    NgbModule,
    MarkdownToHtmlModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToasterModule,
    LoaderModule
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
    NotifyService
  ],
  entryComponents: [
    SettingsComponent,
    RoomAddFormComponent,
    RoomEditFormComponent,
    RoomPasswordFormComponent
  ]
})
export class ChatModule { }
