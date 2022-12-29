import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { modelDialog, PrintLayout,  } from 'src/app/models';
import { SuppliersService } from 'src/app/suppliers/suppliers.service';

@Component({
  selector: 'app-layoutsetup',
  templateUrl: './layoutsetup.component.html',
  styleUrls: ['./layoutsetup.component.scss'],
})
export class LayoutSetupComponent implements OnInit {
  
  LayoutData!: PrintLayout[];

  constructor(
    private dialogRef: MatDialogRef<LayoutSetupComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: modelDialog
  ) {}

  ngOnInit(): void {
    this.LayoutData = this.data.data;
  }

  public drop(event: CdkDragDrop<PrintLayout[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.LayoutData);
  }
}
