import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WeighBridge } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeightBridgeService {
  public baseURL: string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL + '/deviceInfo';
  }

  getAllDeviceInfo(): Observable<WeighBridge[]> {
    return this.http.get<WeighBridge[]>(`${this.baseURL}/listAllDeviceInfo`);
  }

  getAllEnabledDeviceInfo(): Observable<WeighBridge[]> {
    return this.http.get<WeighBridge[]>(`${this.baseURL}/findAllByDeviceInfoEnabled`);
  }

  getAllNamesByDeviceInfoEnabled(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/findAllNamesByDeviceInfoEnabled`);
  }

  getDeviceById(name: any): Observable<WeighBridge> {
    return this.http.get<WeighBridge>(`${this.baseURL}/findByDeviceInfo/${name}`);
  }

  createNewDevice(data: WeighBridge) {
    return this.http.post(`${this.baseURL}/create`, data);
  }

  updateDevice( data: WeighBridge): Observable<any> {
    return this.http.put(`${this.baseURL}/update`, data);
  }

  deleteDevice(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllDevices(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }

  getDynamicWeight(url:string): Observable<any>  {
    return this.http.get(url);
  }

  getDeviceVirtualType(): Observable<boolean>  {
    return this.http.get<boolean>(`${this.baseURL}/deviceInfo`);
  }
}
