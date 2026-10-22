import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild {

  constructor ( private authService: AuthService ) { }

  /**
   * Allows the protected pages only to logged in users with a valid (not expired) token,
   * otherwise logs the user out and redirects to the home page
   */
  canActivateChild ( childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
    // Local development has no SSO token
    if (!environment.production) {
      return true;
    }

    // Redirect from the SSO login (e.g. /student/login?token=...), the page stores the new token
    if (childRoute.queryParamMap.has('token')) {
      return true;
    }

    // Admin landing page, it only redirects to the SSO login
    if (state.url === '/admin') {
      return true;
    }

    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.authService.sessionExpired();
    return false;
  }
}
