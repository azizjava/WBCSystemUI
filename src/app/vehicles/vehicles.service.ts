import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { Transporter, User } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {  
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

  getAllVehicle(): Observable<Transporter[]> {
    return this.http
      .get<Transporter[]>(`${this.baseURL}/listAllTransporter`);      
  }

  getVehicleById(id: any): Observable<Transporter> {
    return this.http.get<Transporter>(`${this.baseURL}/findByTransporterCode/${id}`);
  }

  createNewVehicle(data : Transporter) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateVehicle(id: any, data: Transporter): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteVehicle(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllVehicles(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
