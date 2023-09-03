import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { modelDialog, signup, tableOperation, Vehicle } from '../models';
import { AlertService } from '../services';

import { UsersService } from './users.service';
import { UserDataComponent } from './userdata/userdata.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  tblColumns: string[] = [
    'username',
    'email',
    'role',  
    'enabled',
    'Actions',
  ];
  public tableData: any;
  public usersData: signup[] = [];

  public searchInput: string = '';
  public actionName: string = '';
  public sortColumn = { name: 'username', dir: 'asc' };
  public visibleColumns = ['username', 'email', 'Actions'];

  constructor(
    private matDialog: MatDialog,
    private httpService: UsersService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  selectedRecord(actionData: tableOperation): void {
    this.actionName = actionData.action;

    const dialogData = {
      actionName: this.actionName,
      headerText: 'Information',
      data: actionData.data,
    };

    if (this.actionName === 'delete') {
      this.deleteDialog(dialogData);
    } else if (this.actionName === 'edit') {
      this.getUserById(dialogData);
    }
    else {
      this.openDialog(dialogData);
    }
  }

  searchValueChanged(value: string) {
    this.searchInput = value;
  }

  private openDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog';

    const dialogRef = this.matDialog.open(UserDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.actionName === 'edit') {
          console.log('Updated Record !!', result.username);
          this.alertService.success(`${result.username} updated successfully`);
        } else if (this.actionName === 'add') {
          console.log('New Record !!', result.username);
          this.alertService.success(`${result.username} inserted successfully`);
        }

        this.getAllUsers();
      }
    });
  }

  private deleteDialog(dialogData: modelDialog): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;
    dialogConfig.data.message = 'Are you sure you want to delete this item ?';
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this._deleteRecord(dialogData.data);
    });
  }

  private _deleteRecord(selRecord: signup) {
    this.httpService.deleteUser(selRecord?.id || 0).subscribe({
      next: (res) => {
        console.log('Deleted Record !!', selRecord);
        this.getAllUsers();
      },
      error: (e) => {
        console.error(e)
      },
    });
  }  

  private getAllUsers(): void {
    this.httpService.getAllUsers().subscribe({
      next: (data: signup[]) => {
        this.usersData = data;

        this.tableData = data.map((data: signup) => ({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          enabled: data.enabled
        }));
      },
      error: (error: string) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }

  private getUserById(dialogData: any): void {
    this.httpService.getUserById(dialogData.data?.id).subscribe({
      next: (data: signup) => {        
        dialogData.data = data;
        this.openDialog(dialogData);
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(error);
      },
    });
  }
}
