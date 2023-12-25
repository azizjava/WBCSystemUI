import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services';
import { TemplateService } from 'src/app/template/template.service';

declare var $: any; // declaring jquery in this way solved the problem

@Component({
  selector: 'app-printtemplate',
  templateUrl: './printtemplate.component.html',
  styleUrls: ['./printtemplate.component.scss'],
})
export class printTemplateComponent implements OnInit {
  images: any;
  public transactionData: any;
  public entryData: any;
  public exitData: any;
  public printScreen: string = '';

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private httpService: TemplateService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const sequenceNo = params.get('id') || '';
      sequenceNo && this.openPrintLayout(sequenceNo);
    });
  }

  public printLayout() {
    window.print();
  }

  public closeLayout() {
    this.router.navigate(['/dashboard/transactions'], {
      relativeTo: this.route,
    });
  }

  private openPrintLayout(sequenceNo: string): void {
    this.httpService.processJSON(sequenceNo).subscribe({
      next: (data: any) => {
        $('#panel-2 .dropped-in-panel2').remove();
        if (data) {
          this.formatTemplate(data);
        }
      },
      error: (error) => {
        this.alertService.error(error);
      },
    });
  }

  private formatTemplate(results: any) {
    try {
      const panel2Size = results?.panel2Size;
      if (panel2Size) {
        $('#panel-2').css({
          width: panel2Size.width,
          height: panel2Size.height,
        });
      }

      const componentsData = results?.components;
      $('#panel-2 .dropped-in-panel2').remove();
      componentsData.forEach((data: any) => {
        let $newComponent;
        let text = data.text;
        if (data.type === 'label') {
          const orgLbl = data.text.split('=');
          if (orgLbl.length > 1) {
            text = orgLbl[1];
          }
          $newComponent = $(
            '<div class="predefined-label dropped-in-panel2"></div>'
          ).text(text);
        } else {
          $newComponent = $(
            '<div class="draggable dropped-in-panel2"></div>'
          ).text(data.text);

          $(`<div class="card" style="height: 100%;">
                <div class="card-header" style="height: 2.5rem;"></div>
                <div class="card-body"></div>
                </div>`).appendTo($newComponent);
        }

        $newComponent
          .css({
            top: data.top,
            left: data.left,
            width: data.width,
            height: data.height,
            background: data.background,
            border: data.border,
            position: 'absolute',
            'font-weight': data.fontWeight,
            'background-color': data.backgroundColor,
          })
          .appendTo('#panel-2');
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }
}
