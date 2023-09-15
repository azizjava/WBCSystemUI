import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { GlobalConstants } from 'src/app/common';
import { ModaldialogComponent } from 'src/app/common/modaldialog/modaldialog.component';
import { modelDialog } from 'src/app/models';
import { ProjectSetup } from 'src/app/models/projectsetup.model';
import { AlertService } from 'src/app/services';
import { projectSetupService } from 'src/app/services/project.service';
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
    private alertService: AlertService,
    private companyService: projectSetupService,
    private matDialog: MatDialog) {}

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

    this.httpService.updateWeightScaleType({ scale: escale }).subscribe({
      next: (data: any) => {
        this.alertService.success('Data updated successfully.');
        localStorage.setItem('weightScaleType', data.scale);
        this.scaleForm.controls['scaleType'].setValue(data.scale);
        this.selectedscaleType =data.scale;
      },
      error: (error: string) => {
        this.alertService.error(error);
        this.scaleForm.controls['scaleType'].setValue(this.selectedscaleType);
      },
    });
  }

  public  openProjectSetup() :void {
  this.companyService.getCompanyDetails().subscribe({
      next: (result: any) => {
        const dialogData = {
          actionName: 'projectSetup',
          headerText: 'Information',
          data: result !== null ? result :{},
        };
        this.openDialog(dialogData);    
      },
      error: (error: string) => {
        this.alertService.error(error);        
      },
    });

    
  }


  private openDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dialogData;

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(ModaldialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
          this._updateCompanyDetails(result);
      }
      console.log('The dialog was closed', result);
    });
  }

  private _updateCompanyDetails(result :any) {
    const obj :ProjectSetup  = {
      code : '1001',
      companyAddress : result.address,
      contactNo: result.contactno,
      emails : result.email,
      endDate: GlobalConstants.commonFunction.getFormattedSelectedDate(result.date),
      name : result.name,
      transCount: result.count,  
    }

    this.companyService.createNewCompany(obj).subscribe({
      next: (data: any) => {
        this.alertService.success('Data updated successfully.');        
      },
      error: (error: string) => {
        this.alertService.error(error);        
      },
    });

  }
}
