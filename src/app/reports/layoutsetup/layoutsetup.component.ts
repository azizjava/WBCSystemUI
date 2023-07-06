import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { modelDialog, PrintLayout } from 'src/app/models';
import { SuppliersService } from 'src/app/suppliers/suppliers.service';
import { LayoutSetupService } from './layoutsetup.service';
import { AlertService } from 'src/app/services';
import { LayoutSetup } from 'src/app/models/layoutsetup.model';

@Component({
  selector: 'app-layoutsetup',
  templateUrl: './layoutsetup.component.html',
  styleUrls: ['./layoutsetup.component.scss'],
})
export class LayoutSetupComponent implements OnInit {

  LayoutData!: PrintLayout[];

  cardLayout: any;

  cardHeading:any = [];

  cardLayoutDataOrg: any;

  userLang :string ='';

  constructor(
    private dialogRef: MatDialogRef<LayoutSetupComponent>,
    private translate: TranslateService,
    private httpService: LayoutSetupService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {   
     this._generateCardLayout();
    //this.getAllClientDetails();
    this.userLang = this.translate.currentLang ==='en' ? 'us': this.translate.currentLang;
  }

  public drop(event: CdkDragDrop<PrintLayout[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  public trackByFn(index: number, item: LayoutSetup) {
    return item;
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.dialogRef.close(this.LayoutData);
  }

  public getHeaderName(key: string): string {
    
    return this.cardHeading.find((r:any) => r.key === key)?.heading;
  } 

  private getAllClientDetails(): void {
    this.httpService.getAllReportLabels().subscribe({
      next: (data: LayoutSetup[]) => {
        
        var result = data.reduce(function (r, a) {
          r[a.reportName] = r[a.reportName] || [];
          r[a.reportName].push(a);          
          return r;
        }, Object.create([]));

       this.cardLayout =  Object.entries(result);

       this.cardLayoutDataOrg =  [...this.cardLayout];

       console.log(this.cardLayout);

       this.cardLayout.forEach((element: any) => {
        element[element.length] = false;

        const cardTitle = element[1].find((r:LayoutSetup) => r.locale === this.userLang && r.key.toString().includes('.reportTitle'))?.value || '';

        this.cardHeading.push({key :element[0] , heading: cardTitle});

         const unique = [
           ...new Set(element[1].map((item: { key: any }) => item.key)),
         ].filter(
           (s: any) => !['.enabled', '.reportTitle'].some(sub=>s.includes(sub))
         );

         const newArr:any = [];

         unique.forEach((key: any) => {
           let outputData: any = {};
           const item = element[1]
             .filter((e: any) => e.key.toString().includes(key))
             .forEach((a: any) => {
               if (
                 a.locale === 'us' &&
                 !a.key.toString().includes('.enabled')
               ) {
                 outputData.enId = a.id;
                 outputData.enValue = a.value;
                 outputData.key = a.key;
               } else if (a.locale === 'ar') {
                 outputData.arId = a.id;
                 outputData.arValue = a.value;
               }
               if (a.key.toString().includes('.enabled')) {
                 outputData.isEnabled = a.value;
               }
             });
           newArr.push(outputData);
         });
         element[1] = newArr;
       });

       console.log(this.cardLayout);
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

 

  _generateCardLayout() {
    this.cardLayout = [
      {
        cardName: 'Transporters',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: true,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },

      {
        cardName: 'Suppliers',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: true,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },

      {
        cardName: 'Products',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: false,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },

      {
        cardName: 'Customers',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: true,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },

      {
        cardName: 'Vehicles',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: true,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },

      {
        cardName: 'Customer Price List',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: true,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },

      {
        cardName: 'Supplier Price List',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: true,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },

      {
        cardName: 'Log In/Out History',
        data: [
          {
            lableName: 'TranCode',
            lableText: 'Transporter Code',
            enabled: true,
          },
          {
            lableName: 'TranCode1',
            lableText: 'Transporter Code 1',
            enabled: true,
          },
          {
            lableName: 'TranCode2',
            lableText: 'Transporter Code 2',
            enabled: true,
          },
          {
            lableName: 'TranCode3',
            lableText: 'Transporter Code 3',
            enabled: true,
          },
          {
            lableName: 'TranCode 4',
            lableText: 'Transporter Code 4',
            enabled: false,
          },
          {
            lableName: 'TranCode5',
            lableText: 'Transporter Code 5',
            enabled: true,
          },
          {
            lableName: 'TranCode6',
            lableText: 'Transporter Code 6',
            enabled: true,
          },
          {
            lableName: 'TranCode7',
            lableText: 'Transporter Code 7',
            enabled: true,
          },
          {
            lableName: 'TranCode8',
            lableText: 'Transporter Code 8',
            enabled: false,
          },
        ],
        canEdit: false,
      },
    ];
  }
}
