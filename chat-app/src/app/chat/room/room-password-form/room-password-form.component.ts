import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-room-password-form',
  templateUrl: './room-password-form.component.html',
  styleUrls: ['./room-password-form.component.scss']
})
export class RoomPasswordFormComponent {
  @Input() submitCallback: Function;

  public form: FormGroup;

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      password: ['']
    });
  }

  public onClose(event): void {
    this.activeModal.close();
  }

  public onSubmit(event): void {
    this.submitCallback(this.form.controls.password.value);
    this.activeModal.close();
  }
}
