import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { User } from '../../_models/User';
import { UserService } from './../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm')
  editForm: NgForm;

  user: User;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _alertifyService: AlertifyService,
    private _userService: UserService,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  updateUser() {
    this._userService
      .updateUser(this._authService.decodedToken.nameid, this.user)
      .subscribe(
        next => {
          this._alertifyService.success('Profile updated successfully');
          this.editForm.reset(this.user);
        },
        error => {
          this._alertifyService.error(error);
        }
      );
  }
}
