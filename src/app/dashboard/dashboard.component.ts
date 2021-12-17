import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { modelDialog, User } from '../models';
import { TranslateService } from '@ngx-translate/core';
import { ModaldialogComponent } from '../common/modaldialog/modaldialog.component';
import { GlobalConstants,LeftMenuItem } from '../common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public currentUser?: User;
  public actionName: string = '';
  public NavMenu: LeftMenuItem[] = [];

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private matDialog: MatDialog) {

    this.authenticationService.currentUser.subscribe(x => {
      if(x){
      this.currentUser = x;
      this.translate.setDefaultLang(x?.language || 'en');
      translate.use(x?.language);
    }
     
    });

  }

  ngOnInit(): void {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', event => {
        event.preventDefault();
        document.getElementById('mainContainer')?.classList.toggle('sb-sidenav-toggled');
      });
    }

    

    this.getMenuItemsList();
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


  changePassword() {

    this.actionName = 'changePwd';

    const dialogData = { data: null, actionName: this.actionName, headerText: 'Change Password' };

    this.openDialog(dialogData);
  }

  viewProfile() {

    this.actionName = 'viewProfile';

    const dialogData = { actionName: this.actionName, headerText: 'Information', data: this.currentUser };

    this.openDialog(dialogData);
  }

  public trackByFn(index: number, item:LeftMenuItem){
    return item;
  }

  private openDialog(dialogData: modelDialog): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = dialogData;

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;


    const dialogRef = this.matDialog.open(ModaldialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });


  }

  private getMenuItemsList(): void {

    const getLeftNavMenuItemsList = GlobalConstants.commonFunction.getLeftNavMenuItemsList();

    this.translate.get(['']).subscribe(translations => {
    

      getLeftNavMenuItemsList.forEach((element: LeftMenuItem) => {
        element.menuName = this.translate.instant('navleftmenuitemslist.' + element.menuName);
        this.NavMenu.push(element);
      });
  });
   

  

  }

}
