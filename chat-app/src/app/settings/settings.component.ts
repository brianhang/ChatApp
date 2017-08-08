import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

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
  constructor(protected activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    this.form = formBuilder.group({

    });
  }

  /**
   * Closes the modal.
   */
  protected close(): void {
    this.activeModal.close();
  }
}
