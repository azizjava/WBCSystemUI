import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { AlertService } from '../services';
import { WeightBridgeScaleService } from './weighbridgescale.service';

@Component({
  selector: 'app-weightbridgeweight',
  templateUrl: './weighbridgeweight.component.html',
  styleUrls: ['./weighbridgeweight.component.scss'],
})
export class WeightbridgeWeightComponent implements OnInit {

  scaleForm: UntypedFormGroup;
  selectedscaleType :string ='Kg';

  constructor(private httpService: WeightBridgeScaleService,
    private _formBuilder: UntypedFormBuilder,
    private alertService: AlertService) {}

  public ngOnInit() :void {
    this.scaleForm = this._formBuilder.group({    
      scaleType: [this.selectedscaleType, [Validators.required]],
    });

    this.httpService.getWeightScaleType().subscribe({
      next: (data: any) => {
        this.selectedscaleType = data.escale;
        this.scaleForm.controls['scaleType'].setValue(this.selectedscaleType);
      },
      error: (error: string) => {
        this.alertService.error(error);
        this.scaleForm.controls['scaleType'].setValue(this.selectedscaleType);
      },
    });
  }

  public radioChange($event: MatRadioChange) {    
    const data = {
      escale: $event.value.toString().toUpperCase()
    }
    this.httpService.updateWeightScaleType(data).subscribe({
      next: (data: any) => {
        this.alertService.success('Data updated successfully.');        
      },
      error: (error: string) => {
        this.alertService.error(error);
        this.scaleForm.controls['scaleType'].setValue(this.selectedscaleType);
      },
    });
  }
}
