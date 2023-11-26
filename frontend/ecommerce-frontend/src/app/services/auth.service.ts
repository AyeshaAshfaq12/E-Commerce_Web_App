import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSecretKey = 'authToken';
  readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  loginUser(emailAddress: string, password: string): Observable<any> {
    const loginData = { emailAddress, password };

    return this.http.post(`${this.apiUrl}/login`, loginData);
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.authSecretKey);
    // return !!token;
    // alert(!this.jwtHelper.isTokenExpired(token))
    return !this.jwtHelper.isTokenExpired(token);
  }
  getUserId(): any {
    return localStorage.getItem('userId');
  }
  logout(): void {
    this.http.post(this.apiUrl + 'signout', {}, httpOptions);
    localStorage.removeItem(this.authSecretKey);
  }
}
