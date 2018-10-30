import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../_services/auth.service';
import { Message } from '../../_models/Message';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input()
  recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this._authService.decodedToken.nameid;
    this._userService
      .getMessageThread(this._authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap(messages => {
          for (let i = 0; i < messages.length; i++) {
            if (
              messages[i].isRead === false &&
              messages[i].recipientId === currentUserId
            ) {
              this._userService.markAsRead(currentUserId, messages[i].id);
            }
          }
        })
      )
      .subscribe(
        messages => (this.messages = messages),
        error => {
          this._alertifyService.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this._userService
      .sendMessage(this._authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.unshift(message);
          this.newMessage.content = '';
        },
        error => {
          this._alertifyService.error(error);
        }
      );
  }
}
