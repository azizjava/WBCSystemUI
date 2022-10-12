import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Products } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/product';
  }
   
  getAllProducts(): Observable<Products[]> {
    return this.http
      .get<Products[]>(`${this.baseURL}/findAllProducts`);      
  }

  getProductById(id: any): Observable<Products> {
    return this.http.get<Products>(`${this.baseURL}/findByProductCode/${id}`);
  }

  createNewProduct(data : Products) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateProduct(id: any, data: Products): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteProduct(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllProducts(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
