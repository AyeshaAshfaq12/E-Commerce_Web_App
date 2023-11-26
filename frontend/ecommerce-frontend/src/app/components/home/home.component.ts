import { Component } from '@angular/core';
import Product from 'Models/product';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ProductService } from 'src/app/services/product.service';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  products!: Product[];
  layout: 'list' | 'grid' = 'list';
  sortOptions: string[] = [
    'Best Rating',
    'Price: Low to High',
    'Price: High to Low',
  ];

  // NEW INPUT: return items as SelectItem
  get itemsAsSelectItems(): SelectItem[] {
    return this.sortOptions.map(
      (item) => ({ label: item, value: item } as SelectItem)
    );
  }
  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private imageService: ImageUploadService,
    private eventEmitterService: EventEmitterService
  ) {}
  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.products.forEach((pro) => {
        pro.priceHistory.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        pro['price'] = pro.priceHistory[0].price;
        pro['discountedPrice'] =
          pro.priceHistory[0].price *
          ((pro.priceHistory[0].price * pro.priceHistory[0].discount) / 100);
        // if (pro && pro.images && pro.images.length > 0 && pro.images[0]) {
        //   // Check if pro.images[0].buffer and pro.images[0].data exist
        //   if (pro.images[0].image.data.data) {
        //     pro['imageSrc'] = this.imageService.bufferToImage(
        //       pro.images[0].image.data.data,
        //       pro.images[0].image.contentType
        //     );
        //     // alert(pro['imageSrc']);
        //   }
        // }
      });
    });
  }
  getSeverity(product: Product) {
    switch (product.status) {
      case 'Out of Stock':
        return 'warning';

      default:
        return 'sucess';
    }
  }
}
