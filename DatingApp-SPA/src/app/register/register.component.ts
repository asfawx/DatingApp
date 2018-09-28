import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input()
  valuesFromHome: any;
  @Output()
  cancelRegister = new EventEmitter();

  model: any = {};

  constructor(
    private _authService: AuthService,
    private _alertify: AlertifyService
    ) {}

  ngOnInit() {}

  register() {
    this._authService.register(this.model)
      .subscribe(() => {
        this._alertify.success('Registration Successful');
      }, error => {
        this._alertify.error(error);
      });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
