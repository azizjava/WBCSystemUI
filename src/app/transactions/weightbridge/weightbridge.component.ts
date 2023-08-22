import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services';
import { WeightBridgeService } from 'src/app/weighbridgesetting/weightbridge.service';

@Component({
  selector: 'app-weightbridge',
  templateUrl: './weightbridge.component.html',
  styleUrls: ['./weightbridge.component.scss'],
})
export class weightBridgeComponent implements OnInit {
  @Input() isFirstScreen: boolean = true;

  @Output() weightChange: EventEmitter<number> = new EventEmitter<number>();

  public firstWeightdevicesList: any = [];
  public secondWeightdevicesList: any = [];

  private _invalidWeightTypeMsg: string ='';
  private _selectedScaleType: string ='';
  private _isVirtualDevice:boolean = false;

  public constructor(private httpService: WeightBridgeService,
    private translate: TranslateService,
    private alertService: AlertService) {
  }

  public ngOnInit(): void {
    this._selectedScaleType = localStorage.getItem('weightScaleType') || 'KG';
    this.getDeviceVirtualType();
    this.getAllActiveDevices();
    this._getTranslatedText();
  }

  public trackByFn(index: number, item: any) {
    return item.value;
  }

  public weightChangeEvent(item :any): void {
    if (this._isVirtualDevice) {
      item.weight = this._randomIntFromInterval();
      this.weightChange.emit(item.weight);
    } else {
      if (item.endPointURL) {
        this.httpService.getDynamicWeight(item.endPointURL).subscribe({
          next: (res: any) => {
            if (res) {
              if (
                this._selectedScaleType.toLocaleLowerCase() ===
                res.unit?.toLocaleLowerCase()
              ) {
                item.weight =
                  (res.sign.toString() == '+' ? '': res.sign.toString()) +
                  res.data.toString();
                this.weightChange.emit(item.weight);
              } else {
                this.alertService.error(
                  this._invalidWeightTypeMsg + this._selectedScaleType
                );
              }
            }
          },
          error: (error) => {
            console.log(error);
            this.alertService.error(error);
          },
        });
      }
    }
  }  

  private _randomIntFromInterval(min: number = 1, max: number = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getAllActiveDevices(): void {
    this.httpService.getAllNamesByDeviceInfoEnabled().subscribe({
      next: (data: any[]) => {
        this.secondWeightdevicesList = data.filter(d=> d.weightBridgeType ==="SecondWeight");
        this.firstWeightdevicesList = data.filter(d=> d.weightBridgeType ==="FirstWeight");
        this.firstWeightdevicesList.length >0  && this.firstWeightdevicesList.forEach((e:any) =>  {
          e.weight = 0; 
          e.connectStatus =true; 
        });
        this.secondWeightdevicesList.length >0 && this.secondWeightdevicesList.forEach((e:any) =>  {
          e.weight = 0; 
          e.connectStatus =true; 
        });
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getDeviceVirtualType(): void {
    this.httpService.getDeviceVirtualType().subscribe({
      next: (data: boolean) => {
        this._isVirtualDevice = data || false;
      },
      error: (error: string) => {
        this._isVirtualDevice = false;
        this.alertService.error(error);
      },
    });
  }

  private _getTranslatedText(): void {
    this.translate.stream(['']).subscribe((translated: string) => {
      this._invalidWeightTypeMsg = this.translate.instant('weighbridge.invalidtype');
    });
  }
}
