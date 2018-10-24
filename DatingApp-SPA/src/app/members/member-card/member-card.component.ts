import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input()
  user: User;

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _alertifyService: AlertifyService
  ) {}

  ngOnInit() {}

  sendLike(id: number) {
    this._userService
      .sendLike(this._authService.decodedToken.nameid, id)
      .subscribe(data => {
        this._alertifyService.success(`You have liked ${this.user.knownAs}`);
      }, error => {
        this._alertifyService.error(error);
      });
  }
}
