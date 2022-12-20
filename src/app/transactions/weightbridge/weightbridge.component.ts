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

  public connectStatus: boolean = false;
  public weight: number = 0;
  public firstWeightdevicesList: any = [];
  public secondWeightdevicesList: any = [];

  public constructor(private httpService: WeightBridgeService,
    private alertService: AlertService) {

  }

  public ngOnInit(): void {
    this.getAllActiveDevices();
    this._calculateWeight(true);
  }

  public weightChangeEvent(): void {
    this._calculateWeight();
    this.weightChange.emit(this.weight);
  }

  private _calculateWeight(isFirst: boolean = false): void {
    this.weight = this._randomIntFromInterval();
  }

  private _randomIntFromInterval(min: number = 1, max: number = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getAllActiveDevices(): void {
    this.httpService.getAllNamesByDeviceInfoEnabled().subscribe({
      next: (data: any[]) => {
        this.secondWeightdevicesList = data.filter(d=> d.weightBridgeType ==="SecondWeight");
        this.firstWeightdevicesList = data.filter(d=> d.weightBridgeType ==="FirstWeight");
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }
}
