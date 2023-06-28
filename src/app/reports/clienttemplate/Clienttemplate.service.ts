import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


import { environment } from 'src/environments/environment';
import { ClientTemplate } from 'src/app/models/clienttemplate.model';

@Injectable({
  providedIn: 'root',
})
export class ClientTemplateService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/clientdetails';
  }
   
  getAllClientDetails(): Observable<ClientTemplate[]> {
    return this.http
      .get<ClientTemplate[]>(`${this.baseURL}/listall`);      
  } 

  getClientDetailsById(id: any): Observable<ClientTemplate> {
    return this.http.get<ClientTemplate>(`${this.baseURL}/findbyclientdetails/${id}`);
  }

  createNewClientDetails(data : any) {  

    return this.http
      .post<any>(`${this.baseURL}/create`, data);     
  }
 

  updateClientDetails(id: any, data: ClientTemplate): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteClientDetails(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllClientDetails(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
