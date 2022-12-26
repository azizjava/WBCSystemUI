import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { AlertService } from 'src/app/services';
import { WeightBridgeScaleService } from 'src/app/services/weighbridgescale.service';

@Component({
  selector: 'app-weightbridgeweight',
  templateUrl: './weighbridgeweight.component.html',
  styleUrls: ['./weighbridgeweight.component.scss'],
})
export class WeightbridgeWeightComponent implements OnInit {

  scaleForm: UntypedFormGroup;
  selectedscaleType :string;

  constructor(private httpService: WeightBridgeScaleService,
    private _formBuilder: UntypedFormBuilder,
    private alertService: AlertService) {}

  public ngOnInit() :void {
    this.selectedscaleType = localStorage.getItem('weightScaleType') || 'KG';
    this.scaleForm = this._formBuilder.group({    
      scaleType: [this.selectedscaleType, [Validators.required]],
    });
  }  

  public saveSettings() {
    const escale = this.scaleForm.controls['scaleType'].value;
    if(this.selectedscaleType === escale){
      return;
    }

    this.httpService.updateWeightScaleType({ escale: escale }).subscribe({
      next: (data: any) => {
        this.alertService.success('Data updated successfully.');
        localStorage.setItem('weightScaleType', data.escale);
      },
      error: (error: string) => {
        this.alertService.error(error);
        this.scaleForm.controls['scaleType'].setValue(this.selectedscaleType);
      },
    });
  }
}
