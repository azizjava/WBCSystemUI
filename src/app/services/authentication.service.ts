import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, skip } from 'rxjs/operators';

import { signup, User } from '../models';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public baseURL : string;
  private customHttpClient: HttpClient;

  constructor(private http: HttpClient, backend: HttpBackend, private alertService: AlertService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.baseURL = environment.baseURL;
    this.customHttpClient = new HttpClient(backend);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, lang: string) {   

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',}),     
    };
    return this.customHttpClient
      .post<any>(
        `${this.baseURL}/auth/login`,
        { username, password },
        httpOptions
      )
      .pipe(
        map((response) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (response) {
            this.createUserObj(response, lang);
          }
          return true;
        }),
        catchError((error: any) => {
          if (error.status == 0){
            console.log(error?.message);
            return throwError("API is not running!!");
          }
          const errorMsg = error?.error;
          console.log(errorMsg);
          return throwError(errorMsg);
        }),
      );
     
  }

  signup(newUser: signup) {   

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',}),     
    };
    return this.customHttpClient
      .post<any>(`${this.baseURL}/signup/register`, newUser, httpOptions);  
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('weightScaleType');
    this.currentUserSubject.next(null!);
  }
  forgotPassword(username:string){

    return this.customHttpClient
      .post<any>(`/users/forgotPassword`, { username })
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            return user;
          }

          return null;
        })
      );


  }

  createUserObj(data: any,lang: string): void {
    const user: User = {
      id: data.id,
      email: data.email,
      userName: data.username,
      language:lang,
      token:data.accessToken,
      password:'',
      role: data.roles,
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
