import { Injectable, Injector, NgZone, isDevMode } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpErrorResponse, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import EntityUtils from '../utils/entity-utils';
import { retry, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private unauthorized = 401;
  private forbidden = 403;
  private badRequest = 400;
  private unknownError = 0;

  constructor(private injector: Injector, private _zone: NgZone) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localStorageUser = localStorage.getItem('auth_ticket');
    const currentUser = JSON.parse(localStorageUser);
    if (currentUser && currentUser.accessToken)
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        }
      });

    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const authService = this.injector.get(AuthService);
          const router = this.injector.get(Router);

          let message = '';
          if (error.status && error.status === this.forbidden || error.status === this.forbidden)
            this._zone.run(() => alert('Не достатньо прав!'));
          else if (error && error.status === this.unauthorized || error.status === this.unauthorized) {
            authService.webLogout();
            this._zone.run(() => router.navigate(['/login']));
          } else {
            if (error.status === this.badRequest)
              message = error.error.Message || error.error.message;
            else if (error.status === 500)
              message = error.error.exceptionMessage || error.error.Message;
            else if (error.status === 404)
              message = '';
            else if (error.status === this.unknownError)
              message = ''; // 'Еще несколько минут и сайт заработает!';
            else
              message = error.message;

            if (message)
              this._zone.run(() => { alert(message); });
          }

          return throwError(error);
        }),
        map((event: any) => {
          if (event instanceof HttpResponse)
            event = event.clone({ body: EntityUtils.toLowerKeys(event.body) });

          return event;
        })
      );
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
})
export class JwtInterceptorModule { }
