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
    this.baseURL = environment.baseURL +'/transporter';
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

  getAllTransporters(): Observable<Transporter[]> {
    return this.http
      .get<Transporter[]>(`${this.baseURL}/listAllTransporter`);      
  }

  getTransporterById(id: any): Observable<Transporter> {
    return this.http.get<Transporter>(`${this.baseURL}/findByTransporterCode/${id}`);
  }

  createNewTransporter(data : Transporter) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateTransporter(id: any, data: Transporter): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteTransporter(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllTransporters(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
