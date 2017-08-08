import { Component, Input, OnInit } from '@angular/core';
import { User } from '../chat/models/user';

/**
 * This represents a user on the chat server. This will be shown in
 * the side bar.
 */
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  // Reference to the actual user.
  @Input() public user: User;
}
