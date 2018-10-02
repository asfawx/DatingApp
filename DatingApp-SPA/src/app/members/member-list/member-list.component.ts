import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(
    private _userService: UserService,
    private _alertifyService: AlertifyService,
    private _route: ActivatedRoute
    ) { }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.users = data['users'];
    });
  }

  // loadUsers() {
  //   this._userService.getUsers()
  //     .subscribe((users: User[]) => {
  //       this.users = users;
  //     }, error => {
  //       this._alertifyService.error(error);
  //     });
  // }
}
