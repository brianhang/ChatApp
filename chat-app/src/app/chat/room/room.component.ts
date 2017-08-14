import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from '../message/message.service';
import { Message } from '../message/models/message';
import { RoomPipe } from './room.pipe';
import { ChatService } from '../chat/chat.service';
import { User } from '../chat/models/user';
import { TypingService } from '../typing/typing.service';

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
  protected messages: Message[];

  /**
   * Constructor that sets up the list of messages.
   *
   * @param chatService Service for getting chat server information.
   * @param messageService Service for getting messages sent.
   */
  constructor(private chatService: ChatService, private messageService: MessageService, private typingService: TypingService) {
    this.messages = this.messageService.messages;
    this.messageService.messageAdded.subscribe((message) => this.messages = this.messageService.messages.slice());
  }

  /**
   * Called when the user enters text for sending to the chat room.
   *
   * @param content The text content that the user wants to send.
   */
  protected onMessageEntered(content: string): void {
    this.messageService.send(content);
  }

  /**
   * Called when the user changes the text in the message input.
   *
   * @param content The text content that the user has entered.
   */
  protected onMessageChanged(content: any): void {
    this.typingService.setTyping(content.trim().length > 0);
  }

  /**
   * Called when the user stops typing in the message input.
   */
  protected onUserStoppedTyping(event): void {
    this.typingService.setTyping(false);
  }

  /**
   * Returns the user that is viewing the chat room.
   *
   * @return The local user.
   */
  protected get user(): User {
    return this.chatService.user;
  }
}
