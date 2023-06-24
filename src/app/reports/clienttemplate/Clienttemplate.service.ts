import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { ClientTemplate } from 'src/app/models/clienttemplate.model';

@Injectable({
  providedIn: 'root',
})
export class ClientTemplateService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/customer';
  }
   
  getAllCustomers(): Observable<ClientTemplate[]> {
    return this.http
      .get<ClientTemplate[]>(`${this.baseURL}/listAllCustomer`);      
  }

  getAllAllCustomerCodeAndName(): Observable<ClientTemplate[]> {
    return this.http
      .get<ClientTemplate[]>(`${this.baseURL}/listAllCustomerCodeAndName`);      
  }

  getCustomerById(id: any): Observable<ClientTemplate> {
    return this.http.get<ClientTemplate>(`${this.baseURL}/findByCustomerCode/${id}`);
  }

  createNewCustomer(data : ClientTemplate) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateCustomer(id: any, data: ClientTemplate): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteCustomer(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllCustomers(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
