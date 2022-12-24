import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WeighBridge } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeightBridgeScaleService {
  public baseURL: string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL + '/device/scale';
  }

  getWeightScaleType(): Observable<WeighBridge> {
    return this.http.get<WeighBridge>(`${this.baseURL}/findScaleType`);
  }

  updateWeightScaleType(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/save`, data);
  }

 
}
