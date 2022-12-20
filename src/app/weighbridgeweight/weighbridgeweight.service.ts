import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WeighBridge } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeightBridgeWeightService {
  public baseURL: string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL + '/deviceInfo';
  }



  getSelectedWeightType(name: string): Observable<WeighBridge> {
    return this.http.get<WeighBridge>(`${this.baseURL}/findByDeviceInfo/${name}`);
  }

  createNewDevice(data: WeighBridge) {
    return this.http.post(`${this.baseURL}/create`, data);
  }

  updateSelectedWEightType(data: any): Observable<any> {
    return this.http.put(`${this.baseURL}/update`, data);
  }

 
}
