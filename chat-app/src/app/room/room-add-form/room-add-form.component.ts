import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-room-add-form',
  templateUrl: './room-add-form.component.html',
  styleUrls: ['./room-add-form.component.scss']
})
export class RoomAddFormComponent implements OnInit {
  private form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)])]
    });
  }

  ngOnInit() {
  }

}
