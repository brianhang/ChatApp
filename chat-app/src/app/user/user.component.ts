import { Component, Input, OnInit } from '@angular/core';
import { User } from '../chat/models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() public user: User;

  constructor() { }

  ngOnInit() {
  }

}
