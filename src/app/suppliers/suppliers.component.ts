import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalConstants } from '../common/global-constants';
import { modelDialog, Supplier, tableOperation } from '../models';
import { SupplierdataComponent } from './supplierdata/supplierdata.component';


@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {


  tblColumns: string[] = ['Code', 'Name', 'ContactPerson', 'MobileNo', 'PhoneNo', 'FaxNo', 'Address', 'Actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = { name: 'Name', dir: 'asc' };
  public visibleColumns = ['Code', 'Name', 'Actions'];


  constructor(private translate: TranslateService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getTranslatedText();
    this.getData();
  }



  selectedRecord(actionData: tableOperation): void {
    this.actionName = actionData.action;

    const dialogData = { actionName: this.actionName, headerText: 'Information', data: actionData.data };

    if (this.actionName === 'delete') {
      this.deleteDialog(dialogData);
    }
    else { this.openDialog(dialogData); }

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

    const dialogRef = this.matDialog.open(SupplierdataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (this.actionName === "edit") {
        const selRecord: Supplier = {
          Id: dialogData.data?.Id, Code: result.code, Name: result.name, ContactPerson: result.contactPerson,
          MobileNo: result.mobileNo, PhoneNo: result.phoneNo, FaxNo: result.faxNo, Address: result.address,
        };
        this._updateRecord(selRecord);
      }
      else if (this.actionName === "add") { 

        const selRecord: Supplier = {
          Id: GlobalConstants.commonFunction.getNewUniqueId(this.tableData), Code: result.code, Name: result.name, ContactPerson: result.contactPerson,
          MobileNo: result.mobileNo, PhoneNo: result.phoneNo, FaxNo: result.faxNo, Address: result.address,
        };
        this._addRecord(selRecord); 
       }
    });

  }

  private deleteDialog(dialogData: modelDialog): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;
    dialogConfig.data.message = "Are you sure you want to delete this item ?";
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this._deleteRecord(dialogData.data);
    });

  }

  private _deleteRecord(selRecord: Supplier) {
    console.log('Deleted Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData.splice(selIndex, 1);
      this.tableData = [...this.tableData];
    }
  }

  private _addRecord(selRecord: Supplier) {
    console.log('New Record !!', selRecord);
    this.tableData.push(selRecord);  //add the new model object to the dataSource
    this.tableData = [...this.tableData];  //refresh the dataSource
  }

  private _updateRecord(selRecord: Supplier) {
    console.log('Updated Record !!', selRecord);
    const selIndex = this.tableData.findIndex((i: any) => i.Id === selRecord.Id);
    if (this.tableData[selIndex]) {
      this.tableData[selIndex].Code = selRecord.Code;
      this.tableData[selIndex].Name = selRecord.Name;
      this.tableData[selIndex].ContactPerson = selRecord.ContactPerson;
      this.tableData[selIndex].MobileNo = selRecord.MobileNo;
      this.tableData[selIndex].PhoneNo = selRecord.PhoneNo;
      this.tableData[selIndex].Name = selRecord.Name;
    }
  }


  private getTranslatedText(): void {

    this.translate.get(['']).subscribe((translated: string) => {

      this.staticText = {
        searchPlaceholder: this.translate.instant('placeholder.searchtransporters')
      }

    });
  }


  private getData(): void {

    this.tableData = [
      {
        "Id": "1",
        "Code": "transporter 1",
        "Name": "Kimberley Griffin",
        "ContactPerson": "Loraine",
        "MobileNo": "+877 (834) 564-3146",
        "PhoneNo": "+877 (874) 478-3018",
        "FaxNo": "+877 (952) 401-2183",
        "Address": "495 Fulton Street, Elbert, Texas, 6628"
      },
      {
        "Id": "2",
        "Code": "transporter 2",
        "Name": "Horton Cash",
        "ContactPerson": "Diana",
        "MobileNo": "+877 (837) 402-2400",
        "PhoneNo": "+877 (869) 534-3824",
        "FaxNo": "+877 (920) 463-3882",
        "Address": "364 Micieli Place, Golconda, Nebraska, 7878"
      },
      {
        "Id": "3",
        "Code": "transporter 3",
        "Name": "Cote Bass",
        "ContactPerson": "Madeline",
        "MobileNo": "+877 (898) 591-3637",
        "PhoneNo": "+877 (889) 445-3891",
        "FaxNo": "+877 (961) 524-3145",
        "Address": "405 Barbey Street, Tibbie, Michigan, 2087"
      },
      {
        "Id": "4",
        "Code": "transporter 4",
        "Name": "Cara Kirk",
        "ContactPerson": "Cummings",
        "MobileNo": "+877 (933) 535-2375",
        "PhoneNo": "+877 (879) 420-2777",
        "FaxNo": "+877 (840) 479-2118",
        "Address": "671 Wythe Place, Deseret, New Hampshire, 7148"
      },
      {
        "Id": "5",
        "Code": "transporter 5",
        "Name": "Jones Wheeler",
        "ContactPerson": "Lucille",
        "MobileNo": "+877 (938) 451-2107",
        "PhoneNo": "+877 (933) 467-2965",
        "FaxNo": "+877 (842) 562-3145",
        "Address": "942 Brooklyn Avenue, Rehrersburg, Puerto Rico, 2928"
      },
      {
        "Id": "6",
        "Code": "transporter 6",
        "Name": "Walton Webb",
        "ContactPerson": "Houston",
        "MobileNo": "+877 (876) 476-2906",
        "PhoneNo": "+877 (841) 528-3319",
        "FaxNo": "+877 (974) 514-3858",
        "Address": "879 Boerum Place, Morgandale, Maine, 4074"
      },
      {
        "Id": "7",
        "Code": "transporter 7",
        "Name": "Pope Sullivan",
        "ContactPerson": "Branch",
        "MobileNo": "+877 (809) 479-2547",
        "PhoneNo": "+877 (852) 519-2027",
        "FaxNo": "+877 (955) 430-2562",
        "Address": "297 Hicks Street, Calpine, Virgin Islands, 8928"
      },
      
      
    ]

  }


}
