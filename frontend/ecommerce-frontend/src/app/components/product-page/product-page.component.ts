import { Component, Input } from '@angular/core';
import Product from 'Models/product';
import { ImageUploadService } from 'src/app/services/image-upload.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent {
  @Input() product: Product | undefined;
  quantity: number = 0;
  activeIndex: number = 0;

  constructor(private imageService: ImageUploadService) {
    this.product?.priceHistory.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    if (this.product?.priceHistory && this.product?.priceHistory.length > 0) {
      this.product.price = this.product.priceHistory[0].price;
      this.product.discountedPrice =
        this.product.price -
        (this.product.priceHistory[0].discount * this.product.price) / 100;
      if (this.product.status == 'Active') {
        this.product.status = 'In Stock';
      }
      if (this.product.status == 'In Active') {
        this.product.status = 'Not Visible to Customers';
      }
    }
    // this.product?.images.forEach((element) => {
    //   element['imageSrc'] = this.imageService.bufferToImage(
    //     element.image.data.data,
    //     element.image.contentType
    //   );
    //   // alert(element);
    // });
  }

  ngOnInit() {}
}
