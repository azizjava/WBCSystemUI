import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '../../transactions.service';
import { AlertService } from 'src/app/services';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryLayout, NgxGalleryImageSize } from '@kolkov/ngx-gallery';


@Component({
  selector: 'app-viewtransaction',
  templateUrl: './viewtransaction.component.html',
  styleUrls: ['./viewtransaction.component.scss'],
})
export class viewTransactionComponent implements OnInit {
  images :any;
  public transactionData:any;
  public entryData:any;
  public exitData:any;
  public printScreen: string = '';

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private route: ActivatedRoute,
    private httpService: TransactionsService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
    this.galleryImages=[];
    this.galleryOptions = [
      {
          width: '100%',
          height: '500px',
          thumbnailsColumns: 6,
          imageAnimation: NgxGalleryAnimation.Slide,
          imagePercent:85,
          imageAutoPlay: false,
          fullWidth:false,
          previewFullscreen:false,
          preview:false,
          layout : NgxGalleryLayout.ThumbnailsBottom,
          thumbnailsPercent: 15,
          thumbnailSize : NgxGalleryImageSize.Cover,
          thumbnailsMargin: 5,
          thumbnailMargin: 1
      },
      {
        breakpoint: 1400,
        width: '100%',
        height: '350px',
        imagePercent: 85,
        thumbnailsPercent: 15,
        thumbnailsMargin: 5,
        thumbnailMargin: 1
    },
      {
          breakpoint: 800,
          width: '100%',
          height: '320px',
          imagePercent: 85,
          thumbnailsPercent: 12,
          thumbnailsMargin: 5,
          thumbnailMargin: 1
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false,
          width: '100%',
          height: '300px',
          imagePercent: 85,
          thumbnailsPercent: 15,
          thumbnailsMargin: 5,
          thumbnailMargin: 1
      },
      
    ];
  }

  @HostListener("window:beforeprint", ["$event"])
  onBeforePrint() {
    this.cdr.detectChanges();
  }

  public printLayout(section: string): void {
    this.printScreen = section;
    window.print();
    this.printScreen = '';
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const sequenceNo = params.get('id') || '';
      
      sequenceNo && this._getTransactionById(sequenceNo);
    });

   
  }
  
  private _getTransactionById(sequenceNo: string): void {
    this.httpService.getTransactionById(sequenceNo).subscribe({
      next: (data: any) => {
        if (data) {
          this.transactionData = data;
          this.entryData = data.dailyTransactionEntry;
          this.entryData.driverInfo  = this.entryData?.driverLicenseNo +( this.entryData?.driverName ? ' / '+ this.entryData?.driverName :'') +
          ( this.entryData?.nationality ? ' / '+ this.entryData?.nationality :'');
          this.exitData = data.dailyTransactionExit;

          this.images = data.fileNames;

          let thumbnailImg:NgxGalleryImage[] = [];
          this.images.forEach((element: any) => {
            thumbnailImg.push(
              {
                small: element,
                medium: element,
                big: element,
              }
            )
          });
      
           this.galleryImages = thumbnailImg;
        }
      },
      error: (error) => {
        this.alertService.error(error);
      },
    });
  } 

}

