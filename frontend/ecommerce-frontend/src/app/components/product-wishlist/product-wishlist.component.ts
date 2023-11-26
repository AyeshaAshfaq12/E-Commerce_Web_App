import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.component.html',
  styleUrls: ['./product-wishlist.component.css'],
})
export class ProductWishlistComponent {
  wishList: any;
  constructor(
    private wishlistService: WishlistService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  remove(_id: string) {
    if (this.authService.getUserId()) {
      this.wishlistService
        .deleteFromWishlist(this.authService.getUserId(), _id)
        .subscribe(
          (response) => {
            this.wishList = response;
            // this.getWishlist(); // Refresh the wishlist after adding a product
          },
          (error) => {
            console.error('Error adding to wishlist:', error);
            this.messageService.add({
              severity: 'error',
              summary: ' Added to Cart',
              detail: 'product is added to cart sucessfully',
            });
          }
        );
    }
  }
  Reload() {
    if (this.authService.getUserId()) {
      this.wishlistService.getWishlist(this.authService.getUserId()).subscribe(
        (response) => {
          this.wishList = response;
          // this.getWishlist(); // Refresh the wishlist after adding a product
        },
        (error) => {
          console.error('Error adding to wishlist:', error);
          this.messageService.add({
            severity: 'error',
            summary: ' Added to Cart',
            detail: 'product is added to cart sucessfully',
          });
        }
      );
    }
  }
  ngOnInit() {
    this.Reload();
  }
}
