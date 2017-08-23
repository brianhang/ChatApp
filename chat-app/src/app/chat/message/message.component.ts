import { Component, OnInit, Input } from '@angular/core';
import { Message } from './models/message';
import { ChatService } from '../chat/chat.service';
import { MessageService } from '../message/message.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * The MessageComponent represents a message that was sent to the chat server.
 */
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  // The name to show in the message.
  @Input() public message: Message;

  // Whether or not to show the message options (edit, delete, etc...).
  @Input() public showOptions: boolean;

  // How the message should be shown.
  // Default = normal Markdown
  // edit    = show as text area
  public edit: boolean;

  public busy: boolean;

  public form: FormGroup;

  constructor(private messageService: MessageService, private formBuilder: FormBuilder) {
    this.edit = false;
    this.busy = false;

    this.form = this.formBuilder.group({
      content: ['', Validators.minLength(1)]
    });
  }

  public onClickDelete(event): void {
    this.messageService.delete(this.message._id);
  }

  public onClickEdit(event): void {
    this.edit = true;
  }

  public onEditSave(content: string): void {
    if (this.busy || !this.form.valid) {
      return;
    }

    this.busy = true;

    this.messageService.edit(this.message._id, content)
      .then(() => {
        this.edit = false;
        this.busy = false;
      })
      .catch(err => this.busy = false);
  }

  public onEditCancel(event): void {
    this.edit = false;
  }

  public get safeContent(): string {
    return this.message.content
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }
}
