import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, tableOperation, Transporter } from '../models';
import { AlertService } from '../services';
import { TransportersService } from './transporters.service';

import { TransportersdataComponent } from './transportersdata/transportersdata.component';

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.scss'],
})
export class TransportersComponent implements OnInit {
  tblColumns: string[] = [
    'transporterCode',
    'nameOfTransporter',
    'contactPerson',
    'mobileNo',
    'telephoneNo',
    'faxNo',
    'address',
    'Actions',
  ];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'Name', dir: 'asc' };
  public visibleColumns = ['transporterCode', 'nameOfTransporter', 'Actions'];

  constructor(
    private translate: TranslateService,
    private matDialog: MatDialog,
    private httpService: TransportersService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getTranslatedText();
    this.getAllTransporters();
  }

  selectedRecord(actionData: tableOperation): void {
    this.actionName = actionData.action;

    const dialogData = {
      actionName: this.actionName,
      headerText: 'Information',
      data: actionData.data,
    };

    if (this.actionName === 'delete') {
      this.deleteDialog(dialogData);
    } else {
      this.openDialog(dialogData);
    }
  }

  searchValueChanged(value: string) {
    this.searchInput = value;
  }

  private openDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog';

    const dialogRef = this.matDialog.open(
      TransportersdataComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.transporterCode);
          this.alertService.success(`${result.transporterCode} updated successfully`);
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.transporterCode);
          this.alertService.success(`${result.transporterCode} inserted successfully`);
        }

        this.getAllTransporters();
      }
    });
  }

  private deleteDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;
    dialogConfig.data.message = 'Are you sure you want to delete this item ?';
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this._deleteRecord(dialogData.data);
    });
  }

  private _deleteRecord(selRecord: Transporter) {
    this.httpService.deleteTransporter(selRecord.transporterCode).subscribe({
      next: (res) => {
        console.log('Deleted Record !!', selRecord);
        this.getAllTransporters();
      },
      error: (e) => console.error(e),
    });
  }

  private getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        searchPlaceholder: this.translate.instant(
          'placeholder.searchtransporters'
        ),
      };
    });
  }

  private getAllTransporters(): void {
    this.httpService.getAllTransporters().subscribe({
      next: (data: Transporter[]) => {
        this.tableData = data;
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }
}
