import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor ( private authService: AuthService ) { }

  /**
   * Angular forces us to add this method.
   * Angular will call this method for requests leaving our app
   * @param request the request we're intercepting
   * @param next in order to transform the outgoing request before passing it to the next interceptor in the chain.
   * @returns
   */
  intercept ( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const isAuthRequest = request.url.includes('/login') || request.url.includes('/auth/refresh');
    // Every request is user activity: renew the token if it is about to expire
    if (!isAuthRequest) {
      this.authService.refreshTokenIfNeeded();
    }

    const authToken = this.authService.getToken();
    const authRequest = request.clone({
      headers: request.headers.set('authorization', (authToken == undefined) ? 'Bearer undefined' : "Bearer " + authToken)
    });
    return next.handle( authRequest ).pipe(
      catchError((error: HttpErrorResponse) => {
        // Token expired or invalid: drop the session.
        // Only 401s from the auth middleware (controllers also use 401 for other errors)
        if (error.status === 401 && error.headers?.get('X-Auth-Error') === 'true') {
          this.authService.sessionExpired();
        }
        return throwError(() => error);
      })
    );
  }
}
