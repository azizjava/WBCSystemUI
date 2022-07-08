import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ForgotPasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './auth/pagenotfound/pagenotfound.component';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
import { ModaldialogComponent } from './common/modaldialog/modaldialog.component';
import { AuthGuard } from './helper';
import { MaterialModule } from './material.module';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full',  },
  {path: 'login', component: LoginComponent},
  {path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'dashboard',canActivate: [AuthGuard], loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppLoginRoutingModule { }



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent,
    ModaldialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppLoginRoutingModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: false,
      extend: true,
    })
  ]
})
export class AppLoginModule { }

