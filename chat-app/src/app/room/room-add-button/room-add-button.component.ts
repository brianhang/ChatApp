import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomAddFormComponent } from '../room-add-form/room-add-form.component';

@Component({
  selector: 'app-room-add-button',
  templateUrl: './room-add-button.component.html',
  styleUrls: ['./room-add-button.component.scss']
})
export class RoomAddButtonComponent {
  constructor(private modalService: NgbModal) { }

  protected onClick(event): void {
    this.modalService.open(RoomAddFormComponent)
    event.stopPropagation();
  }
}
