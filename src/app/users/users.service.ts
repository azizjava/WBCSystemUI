import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { signup } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public baseURL: string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL + '/user';
  }

  getAllUsers(): Observable<signup[]> {
    return this.http.get<signup[]>(`${this.baseURL}/listAll`);
  } 

  getUserById(id: any): Observable<signup> {
    return this.http.get<signup>(`${this.baseURL}/findBy/${id}`);
  }

  createNewUser(data: signup) {
    return this.http.post(`${this.baseURL}/create`, data);
  }

  updateUser(data: signup): Observable<any> {
    return this.http.put(`${this.baseURL}/update`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete/${id}`);
  }

  deleteAllUsers(): Observable<any> {
    return this.http.delete(`${this.baseURL}/deleteAll`);
  }
}
