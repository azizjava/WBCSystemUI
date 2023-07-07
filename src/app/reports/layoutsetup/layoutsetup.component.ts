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

  cardLayoutOriginal: any;
  cardLayout: any;
  cardHeading: any = [];
  userLang: string = '';

  updatedCardData :any =[];

  constructor(
    private dialogRef: MatDialogRef<LayoutSetupComponent>,
    private translate: TranslateService,
    private httpService: LayoutSetupService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.getAllClientDetails();
    this.userLang = this.translate.currentLang ;
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

  public cancel(layout :any) {
    layout[layout.length-1] =!layout[layout.length-1];
    this.cardLayout = JSON.parse(JSON.stringify(this.cardLayoutOriginal)) ;
    this._formatListData();
  }

  public close() {
    this.dialogRef.close();
  }

  public save(layout :any) {
    layout[layout.length-1] =!layout[layout.length-1];

    if(this.updatedCardData.length >0){
      this.httpService.updateClientDetails(this.updatedCardData).subscribe({
        next: (res: any) => {
          this.dialogRef.close(res);
          this.updatedCardData = [];
        },
        error: (error: string) => {
          console.log(error);
          this.alertService.error(error);
        },
      });
    }    
  }

  public valueChange(value:any, data:any , lang :string, reportName:string): void {

    let val ,key ;
    if(typeof value !=='string') {
      val = value.checked;
      key = data.key +'.enabled';
      
    } else {
      val = value;
      key = data.key;
    }

    const newItem = {id: lang ==='en' ? data.enId : data.arId, locale: lang,  key: key, value: val, reportName: reportName };

    if(this.updatedCardData.length === 0){
      this.updatedCardData.push(newItem);
    }

    else {
      const i = this.updatedCardData.findIndex((_element:any) => _element.id === newItem.id && _element.locale === newItem.locale);
      if (i > -1) this.updatedCardData[i] = newItem; 
      else{
        this.updatedCardData.push(newItem);
      }
      
    }

    console.log(this.updatedCardData);
  }

  public getHeaderName(key: string): string {
    return this.cardHeading.find((r: any) => r.key === key)?.heading;
  }

  private getAllClientDetails(): void {
    this.httpService.getAllReportLabels().subscribe({
      next: (data: LayoutSetup[]) => {
        var result = data.reduce(function (r, a) {
          r[a.reportName] = r[a.reportName] || [];
          r[a.reportName].push(a);
          return r;
        }, Object.create([]));

        this.cardLayout = Object.entries(result);

        this.cardLayoutOriginal = JSON.parse(JSON.stringify(this.cardLayout));

       this._formatListData();        
        
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private _formatListData() :void {

    this.cardLayout.forEach((element: any) => {
      element[element.length] = false;

      const cardTitle =
        element[1].find(
          (r: LayoutSetup) =>
            r.locale === this.userLang &&
            r.key.toString().includes('.reportTitle')
        )?.value || '';

      this.cardHeading.push({ key: element[0], heading: cardTitle });

      const unique = [
        ...new Set(element[1].map((item: { key: any }) => item.key)),
      ].filter(
        (s: any) =>
          !['.enabled', '.reportTitle'].some((sub) => s.includes(sub))
      );

      const newArr: any = [];

      unique.forEach((key: any) => {
        let outputData: any = {};
        const item = element[1]
          .filter((e: any) => e.key.toString().includes(key))
          .forEach((a: any) => {
            if (
              a.locale === 'en' &&
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

            outputData.displayLabel =a.key.toString().split('.')[1];
          });
        newArr.push(outputData);
      });
      element[1] = newArr;
    });

  }
}
