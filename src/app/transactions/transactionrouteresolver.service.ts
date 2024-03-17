import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { Resolve } from '@angular/router';
import { DongleData } from '../models/dongledata.model';
import { DongleSecurityService } from './dongledotnet.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionRouteResolver
  implements Resolve<Observable<DongleData | string>>
{
  constructor(private dongleService: DongleSecurityService) {}

  resolve(): Observable<DongleData | string> {
    return this.dongleService.checkIsDongleConnected().pipe(
      catchError((err) => {
        return of(err);
      })
    );
  }
}
