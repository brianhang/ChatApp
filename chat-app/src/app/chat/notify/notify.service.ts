import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class NotifyService {
  constructor(private toasterService: ToasterService, private chatService: ChatService) {
    this.chatService.on('notice', data => {
      if (!data.type) {
        data.type = 'info';
      }

      if (!data.body) {
        data.body = '';
      }

      this.toasterService.pop(data.type, data.title, data.body);
    });
  }
}
