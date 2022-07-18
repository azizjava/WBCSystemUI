import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { PageNotFoundComponent } from './auth/pagenotfound/pagenotfound.component';
import { AuthGuard } from './helper';
import { CustomPreloadingStrategyService } from './services/custom-preloading-strategy.service';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full' },
  { path: 'login', data: {preload: true, loadAfterSeconds: 1}, loadChildren: () => import('./app-login-routing.module').then(m => m.AppLoginRoutingModule) },
  { path: 'dashboard',canActivate: [AuthGuard], loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  {path: 'forgotpassword', loadChildren: () => import('./auth/forgotpassword/forgotpassword.routing.module').then( m=> m.AppForgotPasswordRoutingModule)},
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: CustomPreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
