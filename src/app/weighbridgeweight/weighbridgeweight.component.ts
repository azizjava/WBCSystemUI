import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { dateRange, modelDialog, tableOperation, Transporter, Vehicle, WeighBridge } from '../models';
import { AlertService } from '../services';
import { WeightBridgeWeightService } from './weighbridgeweight.service';


@Component({
  selector: 'app-weightbridgeweight',
  templateUrl: './weighbridgeweight.component.html',
  styleUrls: ['./weighbridgeweight.component.scss'],
})
export class WeightbridgeWeightComponent implements OnInit {
  tblColumns: string[] = [
    'name',
    'weightBridgeType',
    'endPoint',
    'deviceStatus',
    'portNo',
    'baudRate',
    'dataBits',
    'parity',
    'Actions',
  ];
  public tableData: any;
  public devicesData: WeighBridge[] = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'name', dir: 'asc' };
  public visibleColumns = ['name', 'deviceStatus', 'Actions'];

  constructor(
    private matDialog: MatDialog,
    private httpService: WeightBridgeWeightService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getAllDevices();
  }

 

  searchValueChanged(value: string) {
    this.searchInput = value;
  }

  




  private getAllDevices(): void {
    this.httpService.getAllDeviceInfo().subscribe({
      next: (data: WeighBridge[]) => {
        this.devicesData = data;
        this.tableData = data;
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }


}
