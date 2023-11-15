import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { unauthGuard } from './guard/unauth.guard';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate:[unauthGuard]
  },
    {
    path: 'home',
    component: HomeComponent,
    canActivate:[AuthGuard]
  },

    { path: '**', redirectTo: '/login'},
];



@NgModule({
  imports: [RouterModule.forRoot(routes),BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
