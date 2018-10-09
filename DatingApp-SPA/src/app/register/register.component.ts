import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

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

  user: User;

  registerForm: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private _authService: AuthService,
    private _alertify: AlertifyService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-green'
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this._fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);

      this._authService.register(this.user).subscribe(
        () => {
          this._alertify.success('Registration Successful');
        },
        error => {
          this._alertify.error(error);
        }, () => {
          this._authService.login(this.user).subscribe(() => {
            this._router.navigate(['/members']);
          });
        });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
