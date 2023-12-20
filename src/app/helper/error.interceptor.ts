import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { GlobalConstants } from '../common';
import { Router } from '@angular/router';
import { AlertService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router, private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: any) => {
            if (err.status === 201) {
                err.text = err?.error?.text;
                return throwError(err);
            }
            if (err.status === 401) {
              // auto logout if 401 response returned from api
              this.authenticationService.logout();
              location.reload();
            }

            else if (err.status === 404) {   
              if(err?.url?.toString().includes("ticket/find")){
                return throwError(err?.error);
              }                
              this.alertService.error("API is not found!!");             
              return throwError("API is not found!!");
            }

            else if (err.status === 0) {
              // auto logout if 401 response returned from api
              //this.authenticationService.logout();               
              this.alertService.error("API is not running!!");
              console.log(err.message);
              //this.router.navigate([GlobalConstants.ROUTE_URLS.login]);
              return throwError("API is not running!!");
            }

            const error = err.error || err.message || err.statusText;
            return throwError(error);
          }))
      }
}