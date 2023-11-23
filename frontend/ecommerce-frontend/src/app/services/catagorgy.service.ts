import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatagorgyService {
  readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getCategory(product: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/category`);
  }
}
