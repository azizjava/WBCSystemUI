import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductGroupsComponent } from './productgroups.component';


const routes: Routes = [{ path: '', component: ProductGroupsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsGroupRoutingModule { }
