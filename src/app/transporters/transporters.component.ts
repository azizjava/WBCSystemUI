import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { modelDialog, tableOperation } from '../models';
import { TransportersdataComponent } from './transportersdata/transportersdata.component';

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.scss']
})
export class TransportersComponent implements OnInit {


  tblColumns: string[] = ['code', 'name', 'contactPerson', 'mobileNo', 'phoneNo', 'faxNo', 'address', 'actions' ];
  tableData: any = [];

  public searchInput: string = '';
  public staticText: any = {};
  public actionName: string = '';


  constructor(private translate: TranslateService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getTranslatedText();
    this.getData();
  }



  actionEvent(actionData:tableOperation): void {
    console.log(actionData.data);

    this.actionName = actionData.action;

    const dialogData = { actionName: this.actionName, headerText: 'Information', data: actionData.data };

    this.openDialog(dialogData);

  }

  searchValueChanged(value: string) {
    this.searchInput = value;
  }

  private openDialog(dialogData: modelDialog): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;


    const dialogRef = this.matDialog.open(TransportersdataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
    });


}

  selectedRecord(row: any, action: string) { }

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
        "code": "transporter 1",
        "name": "Kimberley Griffin",
        "contactPerson": "Loraine",
        "mobileNo": "+877 (834) 564-3146",
        "phoneNo": "+877 (874) 478-3018",
        "faxNo": "+877 (952) 401-2183",
        "address": "495 Fulton Street, Elbert, Texas, 6628"
      },
      {
        "code": "transporter 2",
        "name": "Horton Cash",
        "contactPerson": "Diana",
        "mobileNo": "+877 (837) 402-2400",
        "phoneNo": "+877 (869) 534-3824",
        "faxNo": "+877 (920) 463-3882",
        "address": "364 Micieli Place, Golconda, Nebraska, 7878"
      },
      {
        "code": "transporter 3",
        "name": "Cote Bass",
        "contactPerson": "Madeline",
        "mobileNo": "+877 (898) 591-3637",
        "phoneNo": "+877 (889) 445-3891",
        "faxNo": "+877 (961) 524-3145",
        "address": "405 Barbey Street, Tibbie, Michigan, 2087"
      },
      {
        "code": "transporter 4",
        "name": "Cara Kirk",
        "contactPerson": "Cummings",
        "mobileNo": "+877 (933) 535-2375",
        "phoneNo": "+877 (879) 420-2777",
        "faxNo": "+877 (840) 479-2118",
        "address": "671 Wythe Place, Deseret, New Hampshire, 7148"
      },
      {
        "code": "transporter 5",
        "name": "Jones Wheeler",
        "contactPerson": "Lucille",
        "mobileNo": "+877 (938) 451-2107",
        "phoneNo": "+877 (933) 467-2965",
        "faxNo": "+877 (842) 562-3145",
        "address": "942 Brooklyn Avenue, Rehrersburg, Puerto Rico, 2928"
      },
      {
        "code": "transporter 6",
        "name": "Walton Webb",
        "contactPerson": "Houston",
        "mobileNo": "+877 (876) 476-2906",
        "phoneNo": "+877 (841) 528-3319",
        "faxNo": "+877 (974) 514-3858",
        "address": "879 Boerum Place, Morgandale, Maine, 4074"
      },
      {
        "code": "transporter 7",
        "name": "Pope Sullivan",
        "contactPerson": "Branch",
        "mobileNo": "+877 (809) 479-2547",
        "phoneNo": "+877 (852) 519-2027",
        "faxNo": "+877 (955) 430-2562",
        "address": "297 Hicks Street, Calpine, Virgin Islands, 8928"
      },
      {
        "code": "transporter 8",
        "name": "Zelma Simon",
        "contactPerson": "Salas",
        "mobileNo": "+877 (958) 590-2055",
        "phoneNo": "+877 (856) 410-2331",
        "faxNo": "+877 (874) 525-3525",
        "address": "556 Merit Court, Marbury, South Dakota, 4750"
      },
      {
        "code": "transporter 9",
        "name": "Shields Scott",
        "contactPerson": "Berger",
        "mobileNo": "+877 (863) 592-2525",
        "phoneNo": "+877 (876) 442-2617",
        "faxNo": "+877 (984) 498-2045",
        "address": "755 Vermont Street, Matheny, Massachusetts, 3420"
      },
      {
        "code": "transporter 10",
        "name": "Carson Griffith",
        "contactPerson": "Cherry",
        "mobileNo": "+877 (839) 467-2246",
        "phoneNo": "+877 (845) 489-3615",
        "faxNo": "+877 (969) 452-2589",
        "address": "433 Conselyea Street, Fannett, District Of Columbia, 5055"
      },
      {
        "code": "transporter 12",
        "name": "Fields Haney",
        "contactPerson": "Gretchen",
        "mobileNo": "+877 (881) 540-2826",
        "phoneNo": "+877 (846) 452-2632",
        "faxNo": "+877 (911) 427-2048",
        "address": "203 Whitney Avenue, Stockwell, Rhode Island, 1043"
      },
      {
        "code": "transporter 13",
        "name": "Stevenson Marquez",
        "contactPerson": "Chaney",
        "mobileNo": "+877 (874) 547-3943",
        "phoneNo": "+877 (981) 498-3732",
        "faxNo": "+877 (862) 443-3108",
        "address": "375 Llama Court, Belgreen, American Samoa, 4313"
      },
      {
        "code": "transporter 14",
        "name": "Perry Romero",
        "contactPerson": "Lois",
        "mobileNo": "+877 (841) 411-2533",
        "phoneNo": "+877 (830) 520-2878",
        "faxNo": "+877 (952) 582-2745",
        "address": "284 Arlington Place, Nutrioso, Colorado, 2009"
      },
      {
        "code": "transporter 15",
        "name": "Jaime Gilbert",
        "contactPerson": "Conley",
        "mobileNo": "+877 (998) 499-3393",
        "phoneNo": "+877 (890) 499-2604",
        "faxNo": "+877 (948) 561-3047",
        "address": "172 Apollo Street, Waumandee, Oregon, 9974"
      },
      {
        "code": "transporter 16",
        "name": "Huffman Navarro",
        "contactPerson": "Jessica",
        "mobileNo": "+877 (851) 592-3923",
        "phoneNo": "+877 (923) 420-3694",
        "faxNo": "+877 (950) 597-2675",
        "address": "754 Arion Place, Bellfountain, Kansas, 7447"
      },
      {
        "code": "transporter 17",
        "name": "Pearl Gallegos",
        "contactPerson": "Swanson",
        "mobileNo": "+877 (997) 524-2329",
        "phoneNo": "+877 (941) 453-2626",
        "faxNo": "+877 (977) 519-3332",
        "address": "257 Whitwell Place, Grapeview, Florida, 6723"
      },
      {
        "code": "transporter 18",
        "name": "Haley Walter",
        "contactPerson": "Pamela",
        "mobileNo": "+877 (934) 466-3232",
        "phoneNo": "+877 (965) 582-3431",
        "faxNo": "+877 (964) 536-3892",
        "address": "158 Bayview Avenue, Castleton, New Jersey, 1781"
      },
      {
        "code": "transporter 19",
        "name": "Mercado Diaz",
        "contactPerson": "Francisca",
        "mobileNo": "+877 (932) 577-3899",
        "phoneNo": "+877 (889) 493-2066",
        "faxNo": "+877 (899) 477-3188",
        "address": "200 Navy Street, Graball, Virginia, 6070"
      },
      {
        "code": "transporter 20",
        "name": "Hart Estrada",
        "contactPerson": "Toni",
        "mobileNo": "+877 (861) 465-2246",
        "phoneNo": "+877 (893) 462-2144",
        "faxNo": "+877 (844) 442-2647",
        "address": "823 Orange Street, Monument, Tennessee, 7530"
      },
      {
        "code": "transporter 21",
        "name": "Welch Potts",
        "contactPerson": "Christie",
        "mobileNo": "+877 (941) 455-3008",
        "phoneNo": "+877 (863) 415-3897",
        "faxNo": "+877 (985) 481-2544",
        "address": "270 Sands Street, Avalon, Delaware, 1722"
      },
      {
        "code": "transporter 22",
        "name": "Marva Kirkland",
        "contactPerson": "Lynn",
        "mobileNo": "+877 (983) 526-2081",
        "phoneNo": "+877 (964) 461-2036",
        "faxNo": "+877 (846) 432-2878",
        "address": "312 Cadman Plaza, Kingstowne, Montana, 6984"
      }
    ]

  }


}
