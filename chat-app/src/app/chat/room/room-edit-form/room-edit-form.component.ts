import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatService } from '../../../chat/chat/chat.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Room } from '../models/room';

@Component({
  selector: 'app-room-edit-form',
  templateUrl: './room-edit-form.component.html',
  styleUrls: ['./room-edit-form.component.scss']
})
export class RoomEditFormComponent {
  public room: Room;
  public form: FormGroup;
  public busy: boolean;
  public error: string;

  /**
   * Constructor that sets up the form and services.
   *
   * @param activeModal Service for getting the create room modal.
   * @param formBuilder Service for validating the room create form.
   * @param chatService Service for requesting rooms on the server.
   */
  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private chatService: ChatService) {
    this.room = this.chatService.user.room;

    if (!this.room) {
      this.activeModal.close();

      return;
    }

    this.busy = false;
    this.error = '';

    this.form = formBuilder.group({
      name: [this.room.name, Validators.compose([Validators.required, Validators.minLength(1)])],
      description: [this.room.description],
      password: ['']
    });

    // Handle the change response from the server.
    this.chatService.on('roomEditResult', (data: any) => {
      const status: boolean = data.status;
      const message: string = data.message;

      if (status) {
        this.activeModal.close();
      } else {
        this.busy = false;
        this.error = message || 'An unknown error has occured';
      }
    });
  }

  /**
   * Called when the user presses the create button for the create room form.
   * This should take the form data and send it to the server to create
   * the room.
   *
   * @param event Information about the event that led to this submission.
   */
  public onSubmit(event): void {
    if (this.busy || !this.room || !this.form.valid) {
      return;
    }

    // Prepare the changes that we will submit.
    const changes: any = {
      roomId: this.room.id
    };

    // Add the name if changed.
    if (this.form.controls.name.dirty) {
      changes.name = this.form.controls.name.value;

      if (changes.name.length === 0) {
        this.error = 'The room name can not be empty';
        this.busy = false;

        return;
      }
    }

    // Add the description if changed.
    if (this.form.controls.description.dirty) {
      changes.description = this.form.controls.description.value;
    }

    // Add the password if changed.
    if (this.form.controls.password.dirty) {
      changes.password = this.form.controls.password.value;
    }

    console.log(changes);
    // Submit the changes
    this.busy = true;
    this.chatService.emit('roomEdit', changes);
  }

  /**
   * Called when the user clicks on the delete password button. This will
   * set the password to be empty and mark as dirty so a blank password can
   * be sent.
   *
   * @param event Information about the click event.
   */
  public onDeletePassword(event): void {
    this.form.controls.password.setValue('');
    this.form.controls.password.markAsDirty();
  }

  /**
   * Called when the delete button is pressed. This will send a reques to have
   * the room deleted.
   *
   * @param event Information about the delete button click event.
   */
  public onDelete(event): void {
    if (this.busy || !this.room) {
      return;
    }

    this.busy = true;
    this.chatService.emit('roomEdit', { roomId: this.room._id, delete: true });
  }

  /**
   * Called when the user presses the close button on the form. This will
   * cause the close button to actually close the form.
   *
   * @param event Information about the close button click event.
   */
  public onClose(event): void {
    this.activeModal.close();
  }
}
