import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { modelDialog, User } from '../models';
import { TranslateService } from '@ngx-translate/core';
import { ModaldialogComponent } from '../common/modaldialog/modaldialog.component';
import { GlobalConstants, LeftMenuItem } from '../common';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public currentUser?: User;
    public actionName: string = '';
    public currentYear: number = 0;
    public NavMenu: LeftMenuItem[] = [];
    public selectedMenu: string = '';

    constructor(private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private translate: TranslateService,
        private matDialog: MatDialog) {

        this.authenticationService.currentUser.subscribe(x => {
            if (x) {
                this.currentUser = x;
                this.translate.setDefaultLang(x?.language || 'en');
                translate.use(x?.language);
            }

        });

    }

    public ngOnInit(): void {
        const sidebarToggle = document.body.querySelector('#sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', event => {
                event.preventDefault();
                document.getElementById('mainContainer')?.classList.toggle('sb-sidenav-toggled');
            });
        }        

        this.currentYear = GlobalConstants.commonFunction.getCurrentYear();

        this.getMenuItemsList();
    }


    public logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }


    public changePassword() {

        this.actionName = 'changePwd';

        const dialogData = { data: null, actionName: this.actionName, headerText: 'Change Password' };

        this.openDialog(dialogData);
    }

    public viewProfile() {

        this.actionName = 'viewProfile';

        const dialogData = { actionName: this.actionName, headerText: 'Information', data: this.currentUser };

        this.openDialog(dialogData);
    }

    public trackByFn(index: number, item: LeftMenuItem) {
        return item;
    }

    public navigateToRoute(menuItem: LeftMenuItem): void {

        if (menuItem.routePath) {
            this.selectedMenu = menuItem.menuName;
            this.router.navigate([menuItem.routePath], { relativeTo: this.route });
        }
    }

    public isActive(routeName: any): boolean {
        return this.router.url.includes(`/${routeName}`);
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

            this.selectedMenu = this.NavMenu.filter(x => (x.routePath && this.router.url.includes(x.routePath)))[0]?.menuName;
        });


    }



}
