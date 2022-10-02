import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsModule) },
      { path: 'nationality', loadChildren: () => import('../nationality/nationality.module').then(m => m.NationalityModule) },
      { path: 'transporters', loadChildren: () => import('../transporters/transporters.module').then(m => m.TransportersModule) },
      { path: 'transactions', loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsModule) },
      { path: 'vehicle', loadChildren: () => import('../vehicle/vehicle.module').then(m => m.VehicleModule) },
      { path: 'products', loadChildren: () => import('../products/products.module').then(m => m.ProductsModule) },
      { path: 'productgroup', loadChildren: () => import('../productsgroup/productgroups.module').then(m => m.ProductGroupsModule) },
      { path: 'operators', loadChildren: () => import('../operator/operators.module').then(m => m.OperatorsModule) },
      { path: 'customers', loadChildren: () => import('../customer/customers.module').then(m => m.CustomersModule) },
      { path: 'suppliers', loadChildren: () => import('../suppliers/suppliers.module').then(m => m.SuppliersModule) },

    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
