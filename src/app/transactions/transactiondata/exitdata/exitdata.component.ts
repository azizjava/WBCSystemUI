import { Component, ElementRef, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common';
import { findInvalidControls, patternNumberValidator } from 'src/app/helper';
import { Product } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { ProductsService } from 'src/app/supplierproducts/products.service';
import { TransactionsService } from '../../transactions.service';

@Component({
  selector: 'app-transactionexitdata',
  templateUrl: './exitdata.component.html',
  styleUrls: ['./exitdata.component.scss'],
})
export class exitDataComponent implements OnInit, OnChanges {

  @Input() weight : number = 0; 
  @Input() sequenceno : string = '';
  @Input() transactionData: any;
  @Input() selectedScaleType: string = '';
  @Input() actionName: string = '';

  
  exitForm: UntypedFormGroup;
  vehicleList: any = [];
  transportersList: any = [];
  suppliersList: any = [];
  operatorIDList: any = [];
  nationalityList: any = [];
  keyValueData: any = [];
  emptyKeyValue: boolean = false;

  @ViewChild('video5') videoElement5: ElementRef<HTMLVideoElement>;
  @ViewChild('video6') videoElement6: ElementRef<HTMLVideoElement>;
  @ViewChild('video7') videoElement7: ElementRef<HTMLVideoElement>;
  @ViewChild('video8') videoElement8: ElementRef<HTMLVideoElement>;

  @ViewChild('snap5') snap5: ElementRef<HTMLImageElement>;
  @ViewChild('snap6') snap6: ElementRef<HTMLImageElement>;
  @ViewChild('snap7') snap7: ElementRef<HTMLImageElement>;
  @ViewChild('snap8') snap8: ElementRef<HTMLImageElement>;

  @Output() hideSnap5: boolean = true;
  @Output() hideSnap6: boolean = true;
  @Output() hideSnap7: boolean = true;
  @Output() hideSnap8: boolean = true;

  video5: HTMLVideoElement;
  video6: HTMLVideoElement;
  video7: HTMLVideoElement;
  video8: HTMLVideoElement;
  canvas: HTMLCanvasElement;

  constructor(
    private httpService: TransactionsService,
    private _formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private productService: ProductsService,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.exitForm = this._formBuilder.group({
      sequenceNo: [{
        value:this.sequenceno ?? 0,
        disabled: true,
      } ],
      secondWeight: [{
        value: '',
        disabled: true,
      }, [Validators.required, Validators.maxLength(50)]],
      dateOut: [
        {
          value: GlobalConstants.commonFunction.getFormattedDate(),
          disabled: true,
        },
      ],
      timeOut: [
        {
          value: GlobalConstants.commonFunction.getFormattedTime(),
          disabled: true,
        },
      ],
      deductWeight: [0, [Validators.required, Validators.maxLength(50)]],
      netWeight: ['', [Validators.required, Validators.maxLength(50)]],
      priceTons: ['', [Validators.required, Validators.maxLength(50)]],
      totalPrice: ['', [Validators.required, Validators.maxLength(50), patternNumberValidator()]],
      role: [{value :this.authenticationService.currentUserValue.role , disabled: true}],
      loginUserName: [
        {
          value: this.authenticationService.currentUserValue.userName,
          disabled: true,
        },
      ],
      instructions: ['', [Validators.maxLength(250)]],
      deliveryNoteNo: ['', [ Validators.maxLength(50)]],
      orderNo: ['', [Validators.maxLength(50)]],
    });
      
    this.getTransactionById();
    this.keyValueData.length ===0 && this.keyValueData.push({ name: '', value: '' });

    this.exitForm.get('deductWeight')?.valueChanges.subscribe(v => {
      this._calculateNetWeight(v);
    });

    this.exitForm.get('secondWeight')?.valueChanges.subscribe(v => {
      this._calculateNetWeight();
    });

    if (this.actionName === 'view') {
      this.exitForm.disable();
    }

    this.zone.runOutsideAngular(() => {
      if (this.actionName === undefined) {
        setInterval(() => {
          this.exitForm.controls['timeOut'].setValue(
            GlobalConstants.commonFunction.getFormattedTime()
          );
        }, 1000);
      }
    });


    navigator.mediaDevices.enumerateDevices()
      .then(devices => {        
          let videoDevices = devices.filter(function(device) {
            return device.kind === 'videoinput';
          });
          videoDevices.forEach((device, index) => {
            navigator.mediaDevices.getUserMedia({
              video: { deviceId: device.deviceId }
            })
            .then((stream) => {
              switch (index) {
                case 0:                  
                  this.videoElement5.nativeElement.srcObject = stream;
                  this.videoElement5.nativeElement.play();
                  break;
                case 1:                  
                  this.videoElement6.nativeElement.srcObject = stream;
                  this.videoElement6.nativeElement.play();
                  break;
                case 2:
                  this.videoElement7.nativeElement.srcObject = stream;
                  this.videoElement7.nativeElement.play();
                  break;
                case 3:
                  this.videoElement8.nativeElement.srcObject = stream;
                  this.videoElement8.nativeElement.play();
                  break;              
                default:
                  break;
              }
            })
            .catch(error => { console.error('Error getting video stream:', error); });
          });
        }  
      )
      .catch(error => { console.error('Error getting video stream:', error); });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['weight'] && !changes['weight']?.firstChange) {
      this.exitForm.controls['secondWeight'].setValue(changes['weight'].currentValue);
      this._calculateNetWeight();
    }

    if (changes['transactionData'] && !changes['transactionData']?.firstChange) {
      this.getTransactionById();
    }
  }

  public printLayout(): void {
    window.print();
 }

 public reset() {
  this.exitForm.markAsPristine();
  this.exitForm.markAsUntouched();
  this.exitForm.reset();
  this.exitForm.controls['loginUserName'].setValue(
    this.authenticationService.currentUserValue.userName
  );
  this.exitForm.controls['role'].setValue(
    this.authenticationService.currentUserValue.role
  );
  this.exitForm.controls['dateOut'].setValue(
    GlobalConstants.commonFunction.getFormattedDate()
  );
  this.exitForm.controls['timeOut'].setValue(
    GlobalConstants.commonFunction.getFormattedTime()
  );
}

 capture(cameraNumber:number)
 {
   let tmpCanvas = document.createElement('canvas');
   tmpCanvas.width = 1024;
   tmpCanvas.height = 768;
   let ctx: CanvasRenderingContext2D | null;
   if(!( ctx = tmpCanvas.getContext("2d")))
   {
     throw new Error(`2d context not supported or canvas already initialized`);
   }
   
   switch (cameraNumber) {      
     case 5: 
       ctx.drawImage(this.videoElement5.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);
       this.snap5.nativeElement.src = tmpCanvas.toDataURL();
       this.hideSnap5 = false;
       break;
     case 6:         
       ctx.drawImage(this.videoElement6.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
       this.snap6.nativeElement.src = tmpCanvas.toDataURL();   
       this.hideSnap6 = false;
       break;
     case 7:
       ctx.drawImage(this.videoElement7.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
       this.snap7.nativeElement.src = tmpCanvas.toDataURL();
       this.hideSnap7 = false;
       break;
     case 8:
       ctx.drawImage(this.videoElement8.nativeElement, 0, 0, tmpCanvas.width, tmpCanvas.height);   
       this.snap8.nativeElement.src = tmpCanvas.toDataURL();
       this.hideSnap8 = false;
       break;
     default:
       break;      
   }  
 }

 clearsnap(cameraNumber:number)
 {
   switch (cameraNumber) {      
     case 5:          
       this.snap5.nativeElement.src = "";
       this.hideSnap5 = true;
       break;
     case 6:   
       this.snap6.nativeElement.src = "";   
       this.hideSnap6 = true;
       break;
     case 7:
       this.snap7.nativeElement.src = "";
       this.hideSnap7 = true;
       break;
     case 8: 
       this.snap8.nativeElement.src = "";
       this.hideSnap8 = true;        
       break;
     default:
       break;      
   }  
 }

 save() {
  // stop here if form is invalid
  if (!findInvalidControls(this.exitForm)) {
    return;
  }

  const result = this.exitForm.value;

  const newRecord = {
    dailyTransactionEntry:this.transactionData.dailyTransactionEntry,
    dailyTransactionExit: {
      deductWeight: result.deductWeight,
      deliveryNoteNo: result.deliveryNoteNo,
      driverName: result.driverName,
      exitDate: GlobalConstants.commonFunction.getFormattedDate(),
      exitTime:GlobalConstants.commonFunction.getFormattedTime().toUpperCase(),
      exitDeliveryInstructions: result.instructions,
      exitKeyPairs: this.keyValueData,
      exitLoginRoleName: this.authenticationService.currentUserValue.role,
      exitLoginUserName: this.authenticationService.currentUserValue.userName,
      secondWeight: result.secondWeight,
      netWeight: result.netWeight,
      orderNo: result.orderNo,
      pricePerTon: result.priceTons,
      totalPrice: result.totalPrice,     
    },
    sequenceNo: this.sequenceno,
    dailyTransactionStatus: 'TX_COMPLETED',
  };

  var formData: any = new FormData();
    
  formData.append('dailyTransactionRequest', JSON.stringify(newRecord));

  if(this.snap5.nativeElement.src) {    
    const url = this.converterDataURItoBlob(this.snap5.nativeElement.src);
    formData.append('file', url);
  }

  if(this.snap6.nativeElement.src) {    
    const url = this.converterDataURItoBlob(this.snap6.nativeElement.src);
    formData.append('file', url);
  }

  if(this.snap7.nativeElement.src) {    
    const url = this.converterDataURItoBlob(this.snap7.nativeElement.src);
    formData.append('file', url);
  }

  if(this.snap8.nativeElement.src) {    
    const url = this.converterDataURItoBlob(this.snap8.nativeElement.src);
     formData.append('file', url);
  }


  this.httpService.updateTransaction(formData).subscribe({
    next: (result) => {
      this.alertService.success(
        `${result.sequenceNo} updated successfully`
      );
    },
    error: (error) => {
      this.alertService.error(error);
    },
  });
}

  public cancel(): void {
    this.router.navigate(['/dashboard/transactions'], {
      relativeTo: this.route,
    });
  }

  public addKeyValues(event :Event) {
    event.stopPropagation();
    if (this.keyValueData.length === 0) {
      this.emptyKeyValue = false;
      this.keyValueData.push({ name: '', value: '' });
    } else {
      this.emptyKeyValue = this.keyValueData.some((obj: any) => !obj.name);
      if (!this.emptyKeyValue) {
        this.keyValueData.push({ name: '', value: '' });
      }
    }
  }

  public trackByFn(index: number, item: any) {
    return item;
  }
 
 private _calculateNetWeight(deductWgt :number =0): void {

  const result = this.exitForm.value;

  const goodsType = this.transactionData.dailyTransactionEntry.goodsType;
  const firstWeight = +this.transactionData.dailyTransactionEntry.firstWeight;
  const secondWeight = +result.secondWeight || 0;
  const deductWeight = +deductWgt || +result.deductWeight;
  let netWeight = 0; 
  const productPrice = this.exitForm.controls['priceTons'].value;
  

  if(goodsType  === 'incoming'){
    netWeight = (firstWeight -secondWeight) -deductWeight;
  }
  else{
    netWeight = (secondWeight -firstWeight) -deductWeight;
  }

  let totalPrice: number = netWeight * productPrice;
  if(this.selectedScaleType ==='KG'){
    totalPrice =  totalPrice /1000;
  }
  if(this.selectedScaleType ==='LB'){
    totalPrice =  totalPrice /2205;
  }

  totalPrice = parseFloat(totalPrice.toFixed(3));
  this.exitForm.controls['netWeight'].setValue(netWeight);
  this.exitForm.controls['totalPrice'].setValue(totalPrice >0 ? totalPrice : 0);

 }

  private getTransactionById(): void {
    if (this.transactionData &&  this.transactionData.dailyTransactionExit) {

      const data = this.transactionData.dailyTransactionExit;

      if(data.exitLoginUserName){
        this.exitForm.controls['deductWeight'].setValue(data.deductWeight);
        this.exitForm.controls['deliveryNoteNo'].setValue(data.deliveryNoteNo);
        this.exitForm.controls['dateOut'].setValue(data.exitDate);
        this.exitForm.controls['instructions'].setValue(data.exitDeliveryInstructions);
        this.exitForm.controls['role'].setValue(data.exitLoginRoleName);
        this.keyValueData = data.exitKeyPairs;
        
        this.exitForm.controls['loginUserName'].setValue(data.exitLoginUserName);
        this.exitForm.controls['timeOut'].setValue(data.exitTime);
        this.exitForm.controls['netWeight'].setValue(data.netWeight);
        this.exitForm.controls['orderNo'].setValue(data.orderNo);
        this.exitForm.controls['priceTons'].setValue(data.pricePerTon);
        this.exitForm.controls['secondWeight'].setValue(data.secondWeight);
        this.exitForm.controls['totalPrice'].setValue(data.totalPrice);
      }
      
      this._getAllProducts();
      
    }
    
  }

  private _getAllProducts() {
      this.productService.getAllProducts().subscribe({
        next: (data: Product[]) => {          
          this._priceTons(data);   
        },
        error: (error) => {
          console.log(error);
          this.alertService.error(error);
        },
      });   
        
  }

  private _priceTons(productsList :Product[]) {
    const productData = productsList.find(
      (p:Product) =>
        p.productCode === this.transactionData.dailyTransactionEntry.productCode
    );
    if (productData) {
      const price =
        this.transactionData.dailyTransactionEntry.goodsType === 'incoming'
          ? productData.supplierPrice
          : productData.customerPrice;
      this.exitForm.controls['priceTons'].setValue(price);
    }
    
  }

  private converterDataURItoBlob(dataURI: any) {
    let byteString;
    let mimeString;
    let ia;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = encodeURI(dataURI.split(',')[1]);
    }
    // separate out the mime component
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
  }
}
