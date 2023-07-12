import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ReportFormat } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/reports';
  }
   
  findReport(data : ReportFormat) {
    return this.http.get(`${this.baseURL}/findreport`, { params: { ...data} });
  }
  
}
