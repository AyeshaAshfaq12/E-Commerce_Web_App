import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Product from 'Models/product';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent {
  @Input() product!: Product;
  quantity: number = 1;
  activeIndex: number = 0;
  productId!: string | null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}
  get userId() {
    return this.authService.getUserId();
  }
  plus() {
    if (this.quantity < this.product.currentStock) this.quantity++;
  }
  subtract() {
    if (this.quantity > 1) this.quantity--;
  }
  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.productId && !this.product) {
      this.productService.getProduct(this.productId).subscribe((response) => {
        // alert(this.product);
        if (response) {
          this.product = response;
          this.product = this.productService.initProductCust(this.product);
        }
      });
    }
    if (this.product) {
      this.product = this.productService.initProductCust(this.product);
    }
  }
  addToWishlist() {
    this.messageService.add({
      severity: 'error',
      summary: ' Added to Cart',
      detail: 'product is added to cart sucessfully',
    });
    if (this.product._id && this.authService.getUserId()) {
      this.wishlistService
        .addToWishlist(this.authService.getUserId(), this.product._id)
        .subscribe(
          (response) => {
            alert('Added to Wishlist');
            console.log('Product added to wishlist successfully');
            this.messageService.add({
              severity: 'info',
              summary: ' Added to Cart',
              detail: 'product is added to cart sucessfully',
            });
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
}
