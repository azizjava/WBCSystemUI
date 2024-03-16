import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialog,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { findInvalidControls } from 'src/app/helper';
import { modelDialog, Nationality } from 'src/app/models';
import { AlertService, AuthenticationService } from 'src/app/services';
import { TemplateService } from '../template.service';
import { GlobalConstants } from 'src/app/common';

declare var $: any; // declaring jquery in this way solved the problem

@Component({
  selector: 'app-templatedata',
  templateUrl: './templatedata.component.html',
  styleUrls: ['./templatedata.component.scss'],
})
export class TemplateDataComponent implements OnInit, AfterViewInit {
  public staticText: any = {};
  public count = 0;
  public qrCodeUrl = 'http://www.yahoo.com';
  public labelNames: any[] = [];
  public labelValues: any[] = [];
  @ViewChild('myLabelDialog') labelChangeDialog = {} as TemplateRef<any>;

  constructor(
    private translate: TranslateService,
    private matDialog: MatDialog,
    private httpService: TemplateService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.labelNames =
      GlobalConstants.commonFunction.getTemplateLabelNamesList();
    this.labelValues =
      GlobalConstants.commonFunction.getTemplateLabelValuesList();
    this._getTranslatedText();
  }

  // Function to make elements draggable
  makeDraggable(element: any) {
    element.draggable({
      revert: 'invalid',
      appendTo: 'body',
      helper: 'clone',
    });
  }

  addDraggable() {
    this.count++;

    const draggableItem = $(`<div class="draggable" id="item${this.count}">
        <div class="card" style="height: 100%;">
        <div class="card-header" style="height: 2.5rem;">          
        </div>
        <div class="card-body">          
          
        </div>
      </div>
        </div>`);
    $('#panel-1').append(draggableItem);
    this.makeDraggable(draggableItem);
  }

  addQR() {
    this.count++;

    const draggableItem = $(`<div class="draggable" id="item${this.count}">        
        <div id="qrcode${this.count}"></div>
        <script type="text/javascript">
          var qrcode${this.count} = new QRCode(document.getElementById("qrcode${this.count}"), {
            text: "${this.qrCodeUrl}",
            width: 64,
            height: 64,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
          });
        </script>      
        </div>`);
    $('#panel-1').append(draggableItem);
    this.makeDraggable(draggableItem);
  }

  //<qrcode [qrdata]="'http://www.google.com'" ></qrcode>

  editLabelName(label: any, index: number) {
    const dialogData = {
      headerText: 'Information',
      data: label.value,
      labelInfo: label,
      index: index,
    };
    this.openDialog(dialogData);
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      var activeElement: any;
      Array.from(document.getElementsByClassName('predefined-label')).forEach(
        (element) => {
          this.makeDraggable($(element));
        }
      );

      $('#panel-2').resizable();

      // Droppable functionality for panel-2
      $('#panel-2').droppable({
        accept: '.draggable, .predefined-label',
        drop: function (event: any, ui: any) {
          if (!ui.draggable.hasClass('dropped-in-panel2')) {
            const clone = $(ui.helper).clone();
            clone
              .removeClass('ui-draggable')
              .addClass('dropped-in-panel2')
              .css({
                position: 'absolute',
                top: ui.position.top - $(this).offset().top,
                left: ui.position.left - $(this).offset().left,
              })
              .appendTo(this)
              .draggable({
                containment: 'parent',
              })
              .resizable();

            clone.on('click', (event: any) => {
              event.stopPropagation();

              if (!$(event.currentTarget).hasClass('selected')) {              
                $('.selected').removeClass('selected');              
                $(event.currentTarget).addClass('selected');                activeElement = $(event.currentTarget); // Update activeElement
              } else {                
                $(event.currentTarget).removeClass('selected');
                activeElement = null; // Reset activeElement
              }
            });

            if (ui.draggable.hasClass('draggable')) {
              ui.draggable.remove();
            }
          }
        },
      });

      // Clear functionality for panel-2
      $('#clearBtn').on('click', function () {
        $('#panel-2 .dropped-in-panel2').remove();
      });

      // Load functionality
      $('#loadFile').on('change', (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            try {
              const results = JSON.parse(event.target.result);
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
                  if(data.text.indexOf("new QRCode(document.getElementById(")> -1)
                  {
                    const qrcodeDivIdMatch = data.text.match(/document.getElementById\("([^"]+)"\)/);
                    if (qrcodeDivIdMatch && qrcodeDivIdMatch.length > 1) {
                      const qrcodeDivId = qrcodeDivIdMatch[1];
                      
                      $newComponent = $(`<div class="draggable dropped-in-panel2"><div id="${qrcodeDivId}"></div></div>`);                      
                      $(`<script>${data.text}</script>`).appendTo($newComponent);
                    }
                  }
                  else
                  {
                    $newComponent = $(
                      '<div class="draggable dropped-in-panel2"></div>'
                    ).text(data.text);

                    $(`<div class="card" style="height: 100%;">
                    <div class="card-header" style="height: 2.5rem;"></div>
                    <div class="card-body"></div>
                    </div>`).appendTo($newComponent);
                  }
                }

                $newComponent
                  .css({
                    top: data.top,
                    left: data.left,
                    width: data.width,
                    height: data.height,
                    background: data.background,
                    position: 'absolute',
                    'font-weight': data.fontWeight,
                    'background-color' : data.backgroundColor,
                  })
                  .appendTo('#panel-2');

                $newComponent.draggable({ containment: 'parent' }).resizable();

                $newComponent.on('click', (event: any) => {
                  event.stopPropagation();
                  
                  if (!$(event.currentTarget).hasClass('selected')) {                    
                    $('.selected').removeClass('selected');                    
                    $(event.currentTarget).addClass('selected');                    activeElement = $(event.currentTarget);
                  } else {                    
                    $(event.currentTarget).removeClass('selected');
                    activeElement = null;
                  }
                });
              });
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          };
          reader.onerror = function (error) {
            console.error('Error reading file:', error);
            $('#loadFile').val('');
          };
          reader.readAsText(file);
          $('#loadFile').val('');
        }
      });

      $('#setA4').click(function () {
        $('#panel-2').removeClass('a2-size').addClass('a4-size');
      });

      $('#setA2').click(function () {
        $('#panel-2').removeClass('a4-size').addClass('a2-size');
      });

      // Delete functionality for selected component
      $('#deleteBtn').on('click', () => {
        if (activeElement && activeElement.parent().is('#panel-2')) {
          activeElement[0].innerHTML = '';
          activeElement.remove();
          activeElement = null;
          $('.selected').removeClass('selected');
        } else {
          alert('Please select a component in panel 2 to delete it.');
        }
      });
    });
  }

 
  public downloadTemplate() {
    this.httpService.getTemplate().subscribe({
      next: (res: any) => {
        if(res && res?.template) {
          const saveData =  JSON.parse(res?.template);
          this.saveTemplate(saveData);
          this.alertService.success(this.staticText.downloadsuccess);
        }
       
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  public saveTemplate(saveData:any) {    

    const blob = new Blob([JSON.stringify(saveData)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'componentsData.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public savetoServer() {
    const saveData = this._getTemplateData();

    this.httpService.createNewTemplate(saveData).subscribe({
      next: (res: any) => {
        this.alertService.success(this.staticText.updatesuccess);
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });

    this.saveTemplate(saveData);
  }

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        updatesuccess: this.translate.instant('templatedata.updatesuccessful'),         
        downloadsuccess: this.translate.instant('templatedata.downloadsuccess'),         
      };
    });
  }

  private openDialog(dialogData: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(this.labelChangeDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.labelNames[dialogData?.index].value = result;
      }
    });
  }

  private _getTemplateData(): any {
    const componentsData: any = [];
    Array.from($('#panel-2 .dropped-in-panel2')).forEach((element: any) => {
      const $this = $(element);
      const type = $this.hasClass('predefined-label') ? 'label' : 'component';
      let text = $this.text();
      if (type === 'label') {
        const labelInfo = this.labelNames.find((s) => s.value === text.trim());
        if (labelInfo) {
          text = `${labelInfo.key}=${labelInfo.value}`;
        }
        else{
          text = text.trim();
        }
      }
      componentsData.push({
        id: $this.attr('id'),
        type: type,
        text: text,
        top: $this.css('top'),
        left: $this.css('left'),
        width: $this.css('width'),
        height: $this.css('height'),
        fontWeight: $this.css('font-weight'),
        backgroundColor : $this.css('background-color'),      
        background: $this.css('background'),
        border: $this.css('border'),
      });
    });

    const panel2Data = {
      width: $('#panel-2').css('width'),
      height: $('#panel-2').css('height'),
    };

    return {
      components: componentsData,
      panel2Size: panel2Data,
      // colorPickers: colorPickerStates,
    };
  }
}
