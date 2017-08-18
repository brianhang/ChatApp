import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ChatService } from '../chat/chat.service';
import { User } from '../chat/models/user';

/**
 * The SettingsComponent is the form for user settings.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  // The form group for the settings form.
  private form: FormGroup;

  /**
   * Constructor that sets up the settings form.
   *
   * @param activeModal Service for getting the settings modal.
   * @param formBuilder Service for creating the settings form.
   */
  constructor(protected activeModal: NgbActiveModal, private formBuilder: FormBuilder, private chatService: ChatService) {
    this.form = formBuilder.group({
      nickname: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  /**
   * Called when the save button has been pressed. This will submit the changes
   * to the server.
   */
  protected onSubmit(event): void {
    if (!this.form.valid) {
      return;
    }

    if (this.form.controls.nickname.dirty) {
      this.chatService.emit('nickname', this.form.controls.nickname.value);
    }

    this.activeModal.close();
  }

  /**
   * Closes the modal.
   */
  protected close(): void {
    this.activeModal.close();
  }

  /**
   * Returns the local user.
   *
   * @return The user that is logged in.
   */
  protected get user(): User {
    return this.chatService.user;
  }
}
