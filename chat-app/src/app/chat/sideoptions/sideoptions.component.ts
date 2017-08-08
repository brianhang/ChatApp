import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-sideoptions',
  templateUrl: './sideoptions.component.html',
  styleUrls: ['./sideoptions.component.scss']
})
export class SideoptionsComponent {
  /**
   * Constructor that sets up the modal service for settings.
   *
   * @param modalService Service for opening modals.
   */
  constructor(private modalService: NgbModal) { }

  /**
   * Called when the user clicks on the settings button. This will open the
   * settings form in a modal.
   *
   * @param event Information about the settings button click.
   */
  protected openSettings(event): void {
    this.modalService.open(SettingsComponent);
  }
}
