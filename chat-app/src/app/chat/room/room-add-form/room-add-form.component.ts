import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../../chat/chat.service';

/**
 * The RoomAddFormComponent is a form for creating rooms. This allows the user
 * to enter information about their desired room and send that information
 * to the server to actually create a room.
 */
@Component({
  selector: 'app-room-add-form',
  templateUrl: './room-add-form.component.html',
  styleUrls: ['./room-add-form.component.scss']
})
export class RoomAddFormComponent  {
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
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private chatService: ChatService
  ) {
    this.busy = false;
    this.error = '';

    this.form = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      description: [''],
      password: ['']
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
    if (!this.form.valid) {
      return;
    }

    // Get the desired room name.
    const name = this.form.controls.name.value.trim();
    const description = this.form.controls.description.value.trim();
    const password = this.form.controls.password.value;

    this.chatService.on('roomAdd', (data) => {
      const created = data.status;
      const message = data.message;

      // Close the form after the room has been created.
      if (created) {
        this.busy = false;
        this.activeModal.close();

        return;
      }

      this.error = message;
      this.busy = false;
    });

    // Indicate that the room is being created.
    this.busy = true;

    // Request to have the room made.
    this.chatService.emit('roomAdd', {
      name: name,
      description: description,
      password: password
    });
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
