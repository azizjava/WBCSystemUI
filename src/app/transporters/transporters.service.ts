import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { Transporter, User } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransportersService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL;
  }

  

  createObj(data: any,lang: string): void{
    const user: User = {
      id: data.id,
      email: data.email,
      userName: data.username,
      language:lang,
      token:data.jwtToken,
      password:''
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getTransportersList() {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http
      .get<Transporter[]>(`${this.baseURL}/transporter/listAllTransporter`,  httpOptions)
      .pipe(map(result=>result));
  }
}
