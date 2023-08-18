import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Vehicle } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  public baseURL: string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL + '/vehicle';
  }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseURL}/listAllVehicles`);
  }

  getAllVehiclesWithTransporter(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseURL}/listall/platetranscodeandname`);
  }

  getVehicleById(id: any): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseURL}/findByVehiclePlateNo/${id}`);
  }

  createNewVehicle(data: Vehicle) {
    return this.http.post(`${this.baseURL}/create`, data);
  }

  updateVehicle( data: Vehicle): Observable<any> {
    return this.http.put(`${this.baseURL}/update`, data);
  }

  deleteVehicle(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllVehicles(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
}
