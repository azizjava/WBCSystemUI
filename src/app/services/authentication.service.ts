import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { User } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public baseURL : string;
  private customHttpClient: HttpClient;

  constructor(private http: HttpClient, backend: HttpBackend) {
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
      .post<any>(`${this.baseURL}/auth/login`, { username, password }, httpOptions)
      .pipe(
        map((response) => {
           // store user details and jwt token in local storage to keep user logged in between page refreshes
           if (response) {
            this.createUserObj(response,lang);
           }
            
            return (<any>response)._body === '' ? {} : response as any;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
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

  createUserObj(data: any,lang: string): void{
    const user: User = {
      id: data.id,
      email: data.email,
      userName: data.username,
      language:lang,
      token:data.accessToken,
      password:''
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
