import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: 'nationality', loadChildren: () => import('../nationality/nationality.module').then(m => m.NationalityModule) },
      { path: 'transporters', loadChildren: () => import('../transporters/transporters.module').then(m => m.TransportersModule) },
      { path: 'vehicle', loadChildren: () => import('../vehicle/vehicle.module').then(m => m.VehicleModule) },

    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
