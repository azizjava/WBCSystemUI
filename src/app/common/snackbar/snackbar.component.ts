import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { AlertService } from '../../services';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  private subscription!: Subscription;
  message: any;

  constructor(private _snackBar: MatSnackBar,
    private router: Router,
    private alertService: AlertService) {

      router.events.forEach((event) => {
        if(event instanceof NavigationEnd) {
          if(this.message?.type === 'snackbar'){
           this._snackBar?.dismiss();
          }
        }
        
      });

  }

  ngOnInit(): void {

    this.subscription = this.alertService.getAlert()
            .subscribe(message => {
              if (message) {
                switch (message && message.type) {
                  case 'success':
                    message.cssClass = 'bg-primary';
                    break;
                  case 'snackbar':
                  case 'error':
                    message.cssClass = 'bg-danger';
                    break;
                  default:
                    message.cssClass = 'info';
                    break;
                }

                this.message = message;
                if (this.message) {
                  this.openSnackBar(message?.type ==='snackbar' ? true : false);
                }
              }
            });
  }

  openSnackBar(autoclose : boolean) {
    if(!autoclose) {
      this._snackBar.open(this.message?.text || this.message, '', {
        duration: 2500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['mat-toolbar', this.message.cssClass]
      });
    }
    else{
      this._snackBar.open(this.message?.text || this.message,  'Ok',
       {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['mat-toolbar', this.message.cssClass]
      }
      );
    }    

  }

}
