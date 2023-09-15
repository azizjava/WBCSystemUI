import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProjectSetup } from '../models/projectsetup.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class projectSetupService {  
  public baseURL : string;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.baseURL = environment.baseURL +'/company';
  }   

  getCompanyDetails(): Observable<ProjectSetup[]> {
    return this.http.get<ProjectSetup[]>(`${this.baseURL}/details`);
  }

  createNewCompany(data : ProjectSetup) {
    return this.http.post(`${this.baseURL}/create`, data);     
  } 
  
}
