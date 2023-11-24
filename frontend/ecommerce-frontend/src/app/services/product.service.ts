import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}
  createProduct(product: any): Observable<any> {
    console.log(product);
    return this.http.post(`${this.apiUrl}/products`, product);
  }
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }
  getBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/brands`);
  }
  getTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/tags`);
  }
}
