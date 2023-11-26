import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { unauthGuard } from './guard/unauth.guard';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { ProductWishlistComponent } from './components/product-wishlist/product-wishlist.component';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'home/customer',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    component: ProductPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'wishlist',
    component: ProductWishlistComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
