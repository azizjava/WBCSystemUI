import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';


import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { LayoutSetup } from 'src/app/models/layoutsetup.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutSetupService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/reportlabels';
  }
   
  getAllReportLabels(): Observable<LayoutSetup[]> {
    return this.http
      .get<LayoutSetup[]>(`${this.baseURL}/listall`);      
  } 
 

  updateClientDetails(data: LayoutSetup): Observable<any> {
    return this.http.put(`${this.baseURL}/update`, data);
  }

  
  
}
