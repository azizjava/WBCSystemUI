import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/product';
  }
   
  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.baseURL}/findAllProducts`);      
  }

  getProductById(id: any): Observable<Product> {
    return this.http.get<Product>(`${this.baseURL}/findByProductCode/${id}`);
  }

  createNewProduct(data : Product) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateProduct(id: any, data: Product): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteProduct(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllProducts(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
