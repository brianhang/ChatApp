import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent {
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  /**
   * Opens the settings component in a modal.
   */
  public open() {
    this.modalRef = this.modalService.open(SettingsComponent);
  }

  public close() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = undefined;
    }
  }
}
