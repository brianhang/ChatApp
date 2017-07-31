import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(protected activeModal: NgbActiveModal) { }

  /**
   * Closes the modal.
   */
  protected close() {
    this.activeModal.close();
  }
}
