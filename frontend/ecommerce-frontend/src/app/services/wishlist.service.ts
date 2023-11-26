import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWishlist(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/wishlist/${userId}`);
  }

  addToWishlist(userId: string, productId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/wishlist/${userId}/add/${productId}`,
      {}
    );
  }

  deleteFromWishlist(userId: string, productId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/wishlist/${userId}/remove/${productId}`
    );
  }
}
