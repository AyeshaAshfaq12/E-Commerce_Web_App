import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Product from 'Models/product';
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
  initProductCust(pro: Product) {
    pro.priceHistory.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    pro['price'] = pro.priceHistory[0].price;
    pro['discountedPrice'] =
      pro.priceHistory[0].price -
      (pro.priceHistory[0].price * pro.priceHistory[0].discount) / 100;
    pro['status'] = (pro.status = 'Active') ? 'In Stock' : pro.status;
    pro.reviews.forEach((element) => {
      const dateToFormat: Date = new Date(element.date);

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };

      const formattedDate: string = dateToFormat.toLocaleDateString(
        'en-US',
        options
      );
    });
    return pro;
  }
  updateProduct(id: string, product: any): Observable<any> {
    console.log(product);
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }
  updateStock(id: string, newStock: number): Observable<any> {
    // alert(newStock);
    console.error(newStock);
    return this.http.put(`${this.apiUrl}/products/updateStock/${id}`, {
      newStock,
    });
  }
  updatePrice(id: string, price: number, discount: number): Observable<any> {
    const params = { price, discount };
    return this.http.put(`${this.apiUrl}/products/updatePrice/${id}`, params);
  }
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }
  getProduct(id: String): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }
  getBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/brands`);
  }
  getTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/tags`);
  }
}
