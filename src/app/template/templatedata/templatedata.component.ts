import { AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
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
  public labelNames:any[] = [];
  @ViewChild('myLabelDialog') labelChangeDialog = {} as TemplateRef<any>;

  constructor(private translate: TranslateService, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this._getTranslatedText();
    this.labelNames = GlobalConstants.commonFunction.getTemplateLabelNamesList();
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

  editLabelName(label:any, index:number) {
    const dialogData = {
      headerText: 'Information',
      data: label.value,
    };
    this.openDialog(dialogData)
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      var activeElement: any;
      Array.from(document.getElementsByClassName('predefined-label')).forEach(
        (element) => {
          this.makeDraggable($(element));
        }
      );

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
              $('.selected').removeClass('selected');
              $(event.target).addClass('selected');
              activeElement = $(event.target);
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
              const componentsData = JSON.parse(event.target.result);
              $('#panel-2 .dropped-in-panel2').remove();
              componentsData.forEach((data: any) => {
                let $newComponent;
                if (data.type === 'label') {
                  $newComponent = $(
                    '<div class="predefined-label dropped-in-panel2"></div>'
                  ).text(data.text);
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
                  })
                  .appendTo('#panel-2');

                $newComponent.draggable({ containment: 'parent' }).resizable();

                $newComponent.on('click', (event: any) => {
                  $('.selected').removeClass('selected');
                  $(event.target).addClass('selected');
                  activeElement = $(event.target);
                });
              });
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          };
          reader.onerror = function (error) {
            console.error('Error reading file:', error);
          };
          reader.readAsText(file);
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
        console.log(activeElement);
        if (activeElement && activeElement.parent().is('#panel-2')) {
          activeElement.remove();
          activeElement = null;
          $('.selected').removeClass('selected');
        } else {
          alert('Please select a component in panel 2 to delete it.');
        }
      });
    });
  }

  public saveTemplate() {
    const componentsData: any = [];
    Array.from($('#panel-2 .dropped-in-panel2')).forEach((element: any) => {
      console.log('$(this)', element);
      const $this = $(element);
      componentsData.push({
        id: $this.attr('id'),
        type: $this.hasClass('predefined-label') ? 'label' : 'component',
        text: $this.text(),
        top: $this.css('top'),
        left: $this.css('left'),
        width: $this.css('width'),
        height: $this.css('height'),
      });
    });

    const blob = new Blob([JSON.stringify(componentsData)], {
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

  private _getTranslatedText(): void {
    this.translate.get(['']).subscribe((translated: string) => {
      this.staticText = {
        nationality: this.translate.instant(
          'nationality.tbl_header.drivernationality'
        ),
      };
    });
  }

  private openDialog(dialogData: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(this.labelChangeDialog, dialogConfig);

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log(result?.name + ' - ' + result);
    });
  }
}
