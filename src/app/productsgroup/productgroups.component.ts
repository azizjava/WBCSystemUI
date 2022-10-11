
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, ProductGroup,  tableOperation } from '../models';
import { AlertService } from '../services';
import { ProductGroupDataComponent } from './productgroupdata/productgroupdata.component';
import { ProductGroupsService } from './productgroups.service';


@Component({
  selector: 'app-products',
  templateUrl: './productgroups.component.html',
  styleUrls: ['./productgroups.component.scss'],
})
export class ProductGroupsComponent implements OnInit {
  tblColumns: string[] = ['groupCode', 'groupName', 'Actions'];
  tableData: ProductGroup[] = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'groupCode', dir: 'asc' };
  public visibleColumns = ['groupCode', 'groupName', 'Actions'];

  constructor(
    private translate: TranslateService,
    private httpService: ProductGroupsService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getTranslatedText();
    this.getAllProductGroups();
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
    }  else if (this.actionName === 'edit') {
      this.getProductGroupById(dialogData);
    }
    else {
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
      ProductGroupDataComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.groupCode);
          this.alertService.success(`${result.groupCode} updated successfully`);
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.groupCode);
          this.alertService.success(`${result.groupCode} inserted successfully`);
        }

        this.getAllProductGroups();
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

  private _deleteRecord(selRecord: any) {
    this.httpService.deleteProductGroup(selRecord.groupCode).subscribe({
      next: (res) => {
        console.log('Deleted Record !!', selRecord.groupCode);
        this.getAllProductGroups();
      },
      error: (e) => console.error(e),
    });
  }

  private _addRecord(selRecord: ProductGroup) {
    console.log('New Record !!', selRecord);
    this.tableData.push(selRecord); //add the new model object to the dataSource
    this.tableData = [...this.tableData]; //refresh the dataSource
  }

  private _updateRecord(selRecord: ProductGroup) {
    console.log('Updated Record !!', selRecord);
    const selIndex = 0;
    if (this.tableData[selIndex]) {
      this.tableData[selIndex].GroupCode = selRecord.GroupCode;
      this.tableData[selIndex].GroupName = selRecord.GroupName;
    }
  }

  private getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        searchPlaceholder: this.translate.instant('placeholder.searchvehicles'),
      };
    });
  }

  private getAllProductGroups(): void {
    this.httpService.getAllProductGroups().subscribe({
      next: (data: ProductGroup[]) => {
        this.tableData = data;   
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getProductGroupById(dialogData: any): void {
    this.httpService.getProductGroupById(dialogData.data?.groupCode).subscribe({
      next: (data: ProductGroup) => {
        dialogData.data = data;
        this.openDialog(dialogData);
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

}
