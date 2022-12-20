import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { Customer } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/customer';
  }
   
  getAllCustomers(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(`${this.baseURL}/listAllCustomer`);      
  }

  getAllAllCustomerCodeAndName(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(`${this.baseURL}/listAllCustomerCodeAndName`);      
  }

  getCustomerById(id: any): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseURL}/findByCustomerCode/${id}`);
  }

  createNewCustomer(data : Customer) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateCustomer(id: any, data: Customer): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteCustomer(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllCustomers(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
