import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _alertifyService: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this._userService.getUser(route.params['id']).pipe(
      catchError(error => {
        this._alertifyService.error('Problem retrieving the data');
        this._router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
