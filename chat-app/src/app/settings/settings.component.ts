import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  private form: FormGroup;

  constructor(protected activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    this.form = formBuilder.group({

    });
  }

  /**
   * Closes the modal.
   */
  protected close() {
    this.activeModal.close();
  }
}
