import { Component, OnInit,Inject, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { AlertService } from '../../services';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit, OnDestroy {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  private subscription!: Subscription;
  message: any;

  constructor(private _snackBar: MatSnackBar,
    private alertService: AlertService) {

  }

  ngOnInit(): void {

    this.subscription = this.alertService.getAlert()
            .subscribe(message => {
              if (message) {
                switch (message && message.type) {
                  case 'success':
                    message.cssClass = 'bg-primary';
                    break;
                  case 'error':
                    message.cssClass = 'bg-danger';
                    break;
                  default:
                    message.cssClass = 'info';
                    break;
                }

                this.message = message;
                if (this.message) {
                  this.openSnackBar();
                }
              }
            });
  }

  openSnackBar() {
    this._snackBar.open(this.message?.text, '', {
      duration: 2500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['mat-toolbar', this.message.cssClass]
    });

  }



  ngOnDestroy(): void {

  }



}
