import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomAddFormComponent } from '../room-add-form/room-add-form.component';

/**
 * The RoomAddButtonComponent is a button that will be displayed in the side bar
 * and opens the room add form.
 */
@Component({
  selector: 'app-room-add-button',
  templateUrl: './room-add-button.component.html',
  styleUrls: ['./room-add-button.component.scss']
})
export class RoomAddButtonComponent {
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
    this.modalService.open(RoomAddFormComponent)
    event.stopPropagation();
  }
}
