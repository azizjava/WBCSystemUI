import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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

  public constructor(private httpService: WeightBridgeService,
    private alertService: AlertService) {

  }

  public ngOnInit(): void {
    this.getAllActiveDevices();
  }

  public trackByFn(index: number, item: any) {
    return item.value;
  }

  public weightChangeEvent(item :any): void {
    item.weight = this._randomIntFromInterval();
    // this.httpService.getFirstWeight().subscribe({
    //   next: (res: any) => {
    //     item.weight = (res.sign.toString() == "+" ? '': res.sign.toString()) + res.data.toString();
    //     this.weightChange.emit(item.weight);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     // this.alertService.error(error);
    //   },
    // });    
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
}
