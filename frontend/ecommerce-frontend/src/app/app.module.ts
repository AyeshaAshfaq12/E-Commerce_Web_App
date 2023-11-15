import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { httpInterceptorProviders } from './helpers/http.interceptor';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgIdleKeepaliveModule.forRoot(),
       ReactiveFormsModule,
  ],
  providers: [httpInterceptorProviders,{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
