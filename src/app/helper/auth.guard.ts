import { Injectable } from '@angular/core';
import {
  Router,
  CanLoad,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
} from '@angular/router';
import { GlobalConstants } from '../common';

import { AuthenticationService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (!GlobalConstants.commonFunction.isEmptyObject(currentUser)) {
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return true;
  }

  canLoad(route: Route): boolean {
    let url: string = route.path || "";
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      return true;
    }
    // this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    return true;
  }
}
