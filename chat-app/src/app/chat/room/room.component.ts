import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from '../message/message.service';
import { Message } from '../message/models/message';
import { RoomPipe } from './room.pipe';
import { ChatService } from '../chat/chat.service';
import { User } from '../chat/models/user';
import { TypingService } from '../typing/typing.service';
import { VirtualScrollComponent } from 'angular2-virtual-scroll/dist/virtual-scroll';

/**
 * The RoomComponent is where the user can see and send chat messages for a
 * particular room.
 */
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  // A list of messages that have been created in the chat server.
  public messages: Message[];

  // Whether or not more messages are being loaded.
  public busy: boolean;

  /**
   * Constructor that sets up the list of messages.
   *
   * @param chatService Service for getting chat server information.
   * @param messageService Service for getting messages sent.
   */
  constructor(private chatService: ChatService, private messageService: MessageService, private typingService: TypingService) {
    this.messages = this.messageService.messages;

    this.messageService.messageAdded.subscribe(message => this.messages = this.messageService.messages.slice());
    this.messageService.messageDeleted.subscribe(message => this.messages = this.messageService.messages.slice());
  }

  /**
   * Called when the user enters text for sending to the chat room.
   *
   * @param content The text content that the user wants to send.
   */
  public onMessageEntered(content: string): void {
    this.messageService.send(content);
  }

  /**
   * Called when the user changes the text in the message input.
   *
   * @param content The text content that the user has entered.
   */
  public onMessageChanged(content: any): void {
    this.typingService.setTyping(content.trim().length > 0);
  }

  /**
   * Called when the user stops typing in the message input.
   */
  public onUserStoppedTyping(event): void {
    this.typingService.setTyping(false);
  }

  /**
   * Called when the user reached the top of the messages. This should request
   * for earlier messages from the server.
   *
   * @param event Information about the scroll event.
   */
  public onScrolledUp(event): void {
    if (this.busy) {
      return;
    }

    this.busy = true;
    const date = this.messages[0].time;

    this.messageService.requestOlderMessages(date)
      .then(() => this.busy = false)
      .catch((err) => {
        console.error(`Failed to load old messages: ${err}`);
        this.busy = false;
      });
  }

  /**
   * Returns the user that is viewing the chat room.
   *
   * @return The local user.
   */
  public get user(): User {
    return this.chatService.user;
  }
}
