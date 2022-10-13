import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { Supplier, User } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/supplier';
  }
   
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http
      .get<Supplier[]>(`${this.baseURL}/listAllSupplier`);      
  }

  getSupplierById(id: any): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseURL}/findBySupplierCode/${id}`);
  }

  createNewSupplier(data : Supplier) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateSupplier(id: any, data: Supplier): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteSupplier(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllSupplier(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
