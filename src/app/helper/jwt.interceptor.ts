import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

import { AuthenticationService, LoaderService } from '../services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, public loaderService: LoaderService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const isLoginUrl = request.url.toString().includes("auth/login");

        const isFileupload = request.url.toString().includes("clientdetails/create");

        let formdataHeaders = request.headers.set("X-Content-Type", "multipart/form-data");

        if (!isLoginUrl) {

          // add authorization header with jwt token if available
          let currentUser = this.authenticationService.currentUserValue;
          if (currentUser && currentUser?.token) {
            this.loaderService.show();
            // By passing setting content-type header for fileupload
            request = request.clone({                          
              headers: isFileupload ? formdataHeaders : request.headers.set('Content-Type', 'application/json'),
              setHeaders: {
                Authorization: `Bearer ${currentUser.token}`,
              },
            });
          }
          
        }

        return next.handle(request).pipe(
          finalize(() =>{           
            this.loaderService.hide();
          })
      );;
    }
}
