import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product: any;
  // constructor() {}
  constructor(private router: Router, private productService: ProductService) {}
  ngOnInit() {
    this.product = this.productService.initProductCust(this.product);
  }
  onClick() {
    if (this.product._id) {
      this.router.navigate(['/product', this.product._id]);
    }
  }
}
