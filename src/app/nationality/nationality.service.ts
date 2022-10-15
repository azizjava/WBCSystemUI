import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { Nationality } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/drivernationality';
  }
   
  getAllDriverNationalities(): Observable<Nationality[]> {
    return this.http
      .get<Nationality[]>(`${this.baseURL}/listAlldriverNationality`);      
  }

  getNationalityById(id: any): Observable<Nationality> {
    return this.http.get<Nationality>(`${this.baseURL}/findByDriverNationality/${id}`);
  }

  createNewNationality(data : Nationality) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateNationality(id: any, data: Nationality): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteNationality(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllNationalities(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
