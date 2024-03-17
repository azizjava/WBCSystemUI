import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { DongleData } from '../models/dongledata.model';

@Injectable({
  providedIn: 'root',
})
export class DongleSecurityService {  
  public baseURL : string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.securityService ;
  }
     
  checkIsDongleConnected(): Observable<DongleData> {
    return this.http.get<DongleData>(`${this.baseURL}/dongle/code`);
  }

  getClientMachineId(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/machine/id`);
  }
}
