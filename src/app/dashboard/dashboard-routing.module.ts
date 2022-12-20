import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {path: '', redirectTo: 'transactions', pathMatch:'full' },
      { path: 'nationality', loadChildren: () => import('../nationality/nationality.module').then(m => m.NationalityModule) },
      { path: 'transporters', loadChildren: () => import('../transporters/transporters.module').then(m => m.TransportersModule) },
      { path: 'transactions', loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsModule) },
      { path: 'vehicles', loadChildren: () => import('../vehicles/vehicles.module').then(m => m.VehiclesModule) },
      { path: 'customerproducts', loadChildren: () => import('../customerproducts/customerproducts.module').then(m => m.ProductsModule) },
      { path: 'supplierproducts', loadChildren: () => import('../supplierproducts/products.module').then(m => m.ProductsModule) },
      { path: 'reports', loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule) },
      { path: 'customers', loadChildren: () => import('../customer/customers.module').then(m => m.CustomersModule) },
      { path: 'suppliers', loadChildren: () => import('../suppliers/suppliers.module').then(m => m.SuppliersModule) },
      { path: 'weighbridgesetting', loadChildren: () => import('../weighbridgesetting/weighbridgesetting.module').then(m => m.WeighbridgesettingModule) },
      { path: 'weighbridgeweight', loadChildren: () => import('../weighbridgeweight/weighbridgeweight.module').then(m => m.WeighbridgeWeightModule) },
    ]
  },  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
