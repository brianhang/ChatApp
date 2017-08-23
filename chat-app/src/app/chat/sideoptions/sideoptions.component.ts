import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from '../settings/settings.component';
import { Router } from '@angular/router';

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
  constructor(private modalService: NgbModal, private router: Router) { }

  /**
   * Called when the user clicks on the settings button. This will open the
   * settings form in a modal.
   *
   * @param event Information about the settings button click.
   */
  public openSettings(event): void {
    this.modalService.open(SettingsComponent);
  }

  /**
   * Called when the user clicks on the log out button. This will request for
   * the user to be logged out.
   *
   * @param event Information about the click event.
   */
  public onLogout(event): void {
    this.router.navigate(['/logout']);
  }
}
