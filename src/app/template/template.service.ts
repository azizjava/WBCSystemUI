import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  public baseURL: string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL + '/ticket';
  }

  createNewTemplate(data: any) {
    return this.http.post<any>(`${this.baseURL}/create`, data);
  }

  processJSON(data: any) {
    return this.http.post<any>(`${this.baseURL}/processJson`, data);
  }

  getTemplate() {
    return this.http.get<any>(`${this.baseURL}/find`);
  }
}
