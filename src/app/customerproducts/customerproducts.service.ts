import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerProductsService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/customerProduct';
  }
   
  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.baseURL}/listAllProduct`);      
  }

  getProductById(id: any): Observable<Product> {
    return this.http.get<Product>(`${this.baseURL}/findByProductCode/${id}`);
  }

  createNewProduct(data : Product) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateProduct(data: Product): Observable<any> {
    return this.http.put(`${this.baseURL}/update`, data);
  }

  deleteProduct(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllProducts(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
