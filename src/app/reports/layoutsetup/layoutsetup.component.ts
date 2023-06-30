import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { modelDialog, PrintLayout,  } from 'src/app/models';
import { SuppliersService } from 'src/app/suppliers/suppliers.service';

@Component({
  selector: 'app-layoutsetup',
  templateUrl: './layoutsetup.component.html',
  styleUrls: ['./layoutsetup.component.scss'],
})
export class LayoutSetupComponent implements OnInit {
  
  LayoutData!: PrintLayout[];

  cardLayout :any;

  constructor(
    private dialogRef: MatDialogRef<LayoutSetupComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.LayoutData = this.data.data;
    this._generateCardLayout();
  }

  public drop(event: CdkDragDrop<PrintLayout[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.LayoutData);
  }

  _generateCardLayout() {

    this.cardLayout = [
      {
        cardName : "Transporters",
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
        cardName : "Suppliers",
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
        cardName : "Products",
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
        cardName : "Customers",
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
        cardName : "Vehicles",
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
        cardName : "Customer Price List",
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
        cardName : "Supplier Price List",
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
        cardName : "Log In/Out History",
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
