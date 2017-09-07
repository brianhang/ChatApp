import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomEditFormComponent } from '../room-edit-form/room-edit-form.component';

@Component({
  selector: 'app-room-edit-button',
  templateUrl: './room-edit-button.component.html',
  styleUrls: ['./room-edit-button.component.scss']
})
export class RoomEditButtonComponent {
  /**
   * Constructor for the component that sets up the modal service.
   *
   * @param modalService Service for opening the room add form in a modal.
   */
  constructor(private modalService: NgbModal) { }

  /**
   * Called when the user clicks on this component. This will open the
   * room add form.
   *
   * @param event Information about the click event.
   */
  public onClick(event): void {
    this.modalService.open(RoomEditFormComponent);
    event.stopPropagation();
  }
}
