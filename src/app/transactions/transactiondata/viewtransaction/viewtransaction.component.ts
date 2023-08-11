import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '../../transactions.service';
import { AlertService } from 'src/app/services';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';


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

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private route: ActivatedRoute,
    private httpService: TransactionsService,
    private alertService: AlertService,
  ) {
		
    this.galleryOptions = [
      {
          width: '100%',
          height: '300px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          imageAutoPlay: true,
          fullWidth:false,
          previewFullscreen:false,
          preview:false
      },
      {
          breakpoint: 800,
          width: '100%',
          height: '300px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false,
      },
      
    ]
  }

  public printLayout(section:string): void {
    
    let filedSet;
    if(section === 'entry'){
      filedSet = document.getElementById('entrySet') as HTMLFieldSetElement;    
    }

    window.print();    
 }  

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const sequenceNo = params.get('id') || '';
      
      sequenceNo && this._getTransactionById(sequenceNo);
    });

    this.images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

    this.galleryImages = [
      {
          small: this.images[0],
          medium: this.images[0],
          big: this.images[0],
          
      },
      {
        small: this.images[1],
        medium: this.images[1],
      },
      {
        small: this.images[2],
        medium: this.images[2],
      }
  ];
  }
  
  private _getTransactionById(sequenceNo: string): void {
    this.httpService.getTransactionById(sequenceNo).subscribe({
      next: (data: any) => {
        if (data) {
          this.transactionData = data;
          this.entryData = data.dailyTransactionEntry;
          this.exitData = data.dailyTransactionExit;
        }
      },
      error: (error) => {
        this.alertService.error(error);
      },
    });
  } 

}

