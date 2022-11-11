import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transporter, User } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/dailytransaction';
  }
   
  getAllTransactions(): Observable<any[]> {
    return this.http
      .get<Transporter[]>(`${this.baseURL}/listAllDailyTransactions`);      
  }

  getTransactionById(code: any): Observable<any> {
    return this.http.get<Transporter>(`${this.baseURL}/findByDailyTransaction/${code}`);
  }

  createNewTransaction(data : any) {
    return this.http
      .post(`${this.baseURL}/create`, data);     
  }
 

  updateTransaction(data: any): Observable<any> {
    return this.http.put(`${this.baseURL}/update`, data);
  }

  deleteTransaction(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllTransaction(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
  
}
