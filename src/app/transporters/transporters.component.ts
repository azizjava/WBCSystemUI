import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { modelDialog, tableOperation } from '../models';
import { Transporter } from './transporter.model';
import { TransportersdataComponent } from './transportersdata/transportersdata.component';

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.scss']
})
export class TransportersComponent implements OnInit {


  tblColumns: string[] = ['Code', 'Name', 'ContactPerson', 'MobileNo', 'PhoneNo', 'FaxNo', 'Address', 'actions'];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';
  public sortColumn = {name : 'Name' , dir: 'asc'};


  constructor(private translate: TranslateService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getTranslatedText();
    this.getData();
  }



  selectedRecord(actionData: tableOperation): void {
    console.log(actionData.data);

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

    const dialogRef = this.matDialog.open(TransportersdataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
       if(this.actionName ==="edit"){this._updateRecord(dialogData.data);}
       else if(this.actionName ==="add"){this._addRecord(dialogData.data);}
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

  private _deleteRecord(selRecord: Transporter) {
    console.log('Deleted Record !!', selRecord);
  }

  private _addRecord(selRecord: Transporter) {
    console.log('New Record !!', selRecord);
  }

  private _updateRecord(selRecord: Transporter) {
    console.log('Updated Record !!', selRecord);
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
        "Code": "transporter 1",
        "Name": "Kimberley Griffin",
        "ContactPerson": "Loraine",
        "MobileNo": "+877 (834) 564-3146",
        "PhoneNo": "+877 (874) 478-3018",
        "FaxNo": "+877 (952) 401-2183",
        "Address": "495 Fulton Street, Elbert, Texas, 6628"
      },
      {
        "Code": "transporter 2",
        "Name": "Horton Cash",
        "ContactPerson": "Diana",
        "MobileNo": "+877 (837) 402-2400",
        "PhoneNo": "+877 (869) 534-3824",
        "FaxNo": "+877 (920) 463-3882",
        "Address": "364 Micieli Place, Golconda, Nebraska, 7878"
      },
      {
        "Code": "transporter 3",
        "Name": "Cote Bass",
        "ContactPerson": "Madeline",
        "MobileNo": "+877 (898) 591-3637",
        "PhoneNo": "+877 (889) 445-3891",
        "FaxNo": "+877 (961) 524-3145",
        "Address": "405 Barbey Street, Tibbie, Michigan, 2087"
      },
      {
        "Code": "transporter 4",
        "Name": "Cara Kirk",
        "ContactPerson": "Cummings",
        "MobileNo": "+877 (933) 535-2375",
        "PhoneNo": "+877 (879) 420-2777",
        "FaxNo": "+877 (840) 479-2118",
        "Address": "671 Wythe Place, Deseret, New Hampshire, 7148"
      },
      {
        "Code": "transporter 5",
        "Name": "Jones Wheeler",
        "ContactPerson": "Lucille",
        "MobileNo": "+877 (938) 451-2107",
        "PhoneNo": "+877 (933) 467-2965",
        "FaxNo": "+877 (842) 562-3145",
        "Address": "942 Brooklyn Avenue, Rehrersburg, Puerto Rico, 2928"
      },
      {
        "Code": "transporter 6",
        "Name": "Walton Webb",
        "ContactPerson": "Houston",
        "MobileNo": "+877 (876) 476-2906",
        "PhoneNo": "+877 (841) 528-3319",
        "FaxNo": "+877 (974) 514-3858",
        "Address": "879 Boerum Place, Morgandale, Maine, 4074"
      },
      {
        "Code": "transporter 7",
        "Name": "Pope Sullivan",
        "ContactPerson": "Branch",
        "MobileNo": "+877 (809) 479-2547",
        "PhoneNo": "+877 (852) 519-2027",
        "FaxNo": "+877 (955) 430-2562",
        "Address": "297 Hicks Street, Calpine, Virgin Islands, 8928"
      },
      {
        "Code": "transporter 8",
        "Name": "Zelma Simon",
        "ContactPerson": "Salas",
        "MobileNo": "+877 (958) 590-2055",
        "PhoneNo": "+877 (856) 410-2331",
        "FaxNo": "+877 (874) 525-3525",
        "Address": "556 Merit Court, Marbury, South Dakota, 4750"
      },
      {
        "Code": "transporter 9",
        "Name": "Shields Scott",
        "ContactPerson": "Berger",
        "MobileNo": "+877 (863) 592-2525",
        "PhoneNo": "+877 (876) 442-2617",
        "FaxNo": "+877 (984) 498-2045",
        "Address": "755 Vermont Street, Matheny, Massachusetts, 3420"
      },
      {
        "Code": "transporter 10",
        "Name": "Carson Griffith",
        "ContactPerson": "Cherry",
        "MobileNo": "+877 (839) 467-2246",
        "PhoneNo": "+877 (845) 489-3615",
        "FaxNo": "+877 (969) 452-2589",
        "Address": "433 Conselyea Street, Fannett, District Of Columbia, 5055"
      },
      {
        "Code": "transporter 12",
        "Name": "Fields Haney",
        "ContactPerson": "Gretchen",
        "MobileNo": "+877 (881) 540-2826",
        "PhoneNo": "+877 (846) 452-2632",
        "FaxNo": "+877 (911) 427-2048",
        "Address": "203 Whitney Avenue, Stockwell, Rhode Island, 1043"
      },
      {
        "Code": "transporter 13",
        "Name": "Stevenson Marquez",
        "ContactPerson": "Chaney",
        "MobileNo": "+877 (874) 547-3943",
        "PhoneNo": "+877 (981) 498-3732",
        "FaxNo": "+877 (862) 443-3108",
        "Address": "375 Llama Court, Belgreen, American Samoa, 4313"
      },
      {
        "Code": "transporter 14",
        "Name": "Perry Romero",
        "ContactPerson": "Lois",
        "MobileNo": "+877 (841) 411-2533",
        "PhoneNo": "+877 (830) 520-2878",
        "FaxNo": "+877 (952) 582-2745",
        "Address": "284 Arlington Place, Nutrioso, Colorado, 2009"
      },
      {
        "Code": "transporter 15",
        "Name": "Jaime Gilbert",
        "ContactPerson": "Conley",
        "MobileNo": "+877 (998) 499-3393",
        "PhoneNo": "+877 (890) 499-2604",
        "FaxNo": "+877 (948) 561-3047",
        "Address": "172 Apollo Street, Waumandee, Oregon, 9974"
      },
      {
        "Code": "transporter 16",
        "Name": "Huffman Navarro",
        "ContactPerson": "Jessica",
        "MobileNo": "+877 (851) 592-3923",
        "PhoneNo": "+877 (923) 420-3694",
        "FaxNo": "+877 (950) 597-2675",
        "Address": "754 Arion Place, Bellfountain, Kansas, 7447"
      },
      {
        "Code": "transporter 17",
        "Name": "Pearl Gallegos",
        "ContactPerson": "Swanson",
        "MobileNo": "+877 (997) 524-2329",
        "PhoneNo": "+877 (941) 453-2626",
        "FaxNo": "+877 (977) 519-3332",
        "Address": "257 Whitwell Place, Grapeview, Florida, 6723"
      },
      {
        "Code": "transporter 18",
        "Name": "Haley Walter",
        "ContactPerson": "Pamela",
        "MobileNo": "+877 (934) 466-3232",
        "PhoneNo": "+877 (965) 582-3431",
        "FaxNo": "+877 (964) 536-3892",
        "Address": "158 Bayview Avenue, Castleton, New Jersey, 1781"
      },
      {
        "Code": "transporter 19",
        "Name": "Mercado Diaz",
        "ContactPerson": "Francisca",
        "MobileNo": "+877 (932) 577-3899",
        "PhoneNo": "+877 (889) 493-2066",
        "FaxNo": "+877 (899) 477-3188",
        "Address": "200 Navy Street, Graball, Virginia, 6070"
      },
      {
        "Code": "transporter 20",
        "Name": "Hart Estrada",
        "ContactPerson": "Toni",
        "MobileNo": "+877 (861) 465-2246",
        "PhoneNo": "+877 (893) 462-2144",
        "FaxNo": "+877 (844) 442-2647",
        "Address": "823 Orange Street, Monument, Tennessee, 7530"
      },
      {
        "Code": "transporter 21",
        "Name": "Welch Potts",
        "ContactPerson": "Christie",
        "MobileNo": "+877 (941) 455-3008",
        "PhoneNo": "+877 (863) 415-3897",
        "FaxNo": "+877 (985) 481-2544",
        "Address": "270 Sands Street, Avalon, Delaware, 1722"
      },
      {
        "Code": "transporter 22",
        "Name": "Marva Kirkland",
        "ContactPerson": "Lynn",
        "MobileNo": "+877 (983) 526-2081",
        "PhoneNo": "+877 (964) 461-2036",
        "FaxNo": "+877 (846) 432-2878",
        "Address": "312 Cadman Plaza, Kingstowne, Montana, 6984"
      }
    ]

  }


}
