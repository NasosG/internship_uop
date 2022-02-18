import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    const authToken = this.authService.getToken();
    const authRequest = request.clone({
      headers: request.headers.set('authorization', (authToken == undefined) ? 'Bearer undefined' : "Bearer " + authToken)
    });
    return next.handle( authRequest );
  }
}
