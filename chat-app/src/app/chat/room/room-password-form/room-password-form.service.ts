import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RoomPasswordFormComponent } from './room-password-form.component';

@Injectable()
export class RoomPasswordFormService {
  constructor(private modalService: NgbModal) { }

  public prompt(): Promise<string> {
    return new Promise((resolve, reject) => {
      const ref = this.modalService.open(RoomPasswordFormComponent);
      ref.componentInstance.submitCallback = function(password: string) {
        resolve(password);
      }
    });
  }
}
