import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GlobalConstants } from '../common/global-constants';
import { AlertService } from '../services';
import { ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit { 

  public constructor(
    private httpService: ReportsService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    console.log();
  }
  
}
