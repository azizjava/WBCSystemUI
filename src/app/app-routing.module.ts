import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helper';
import { CustomPreloadingStrategyService } from './services/custom-preloading-strategy.service';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full' },
  { path: 'login', data: {preload: true, loadAfterSeconds: 5}, loadChildren: () => import('./app-login-routing.module').then(m => m.AppLoginRoutingModule) },
  { path: 'dashboard',canActivate: [AuthGuard], loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: CustomPreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
