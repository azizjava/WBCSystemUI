import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductGroup } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductGroupsService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/productgroup';
  }
   
  getAllProductGroups(): Observable<ProductGroup[]> {
    return this.http
      .get<ProductGroup[]>(`${this.baseURL}/fetchAllProductGroup`);      
  }

  getProductGroupById(id: any): Observable<ProductGroup> {
    return this.http.get<ProductGroup>(`${this.baseURL}/findByGroupCode/${id}`);
  }

  createNewProductGroup(data : ProductGroup) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateProductGroup(id: any, data: ProductGroup): Observable<any> {
    return this.http.put(`${this.baseURL}/update/${id}`, data);
  }

  deleteProductGroup(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllProductGroups(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
