import { Component, ViewChild } from '@angular/core';
import Product from 'Models/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-body',
  templateUrl: './product-body.component.html',
  styleUrls: ['./product-body.component.css'],
})
export class ProductBodyComponent {
  @ViewChild('dt') dt: Table | undefined;
  products!: Product[];
  productDialog: boolean = false;

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];
  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private imageService: ImageUploadService
  ) {}
  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.products.forEach((pro) => {
        pro.priceHistory.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        pro['price'] = pro.priceHistory[0].price;
        if (pro && pro.images && pro.images.length > 0 && pro.images[0]) {
          // Check if pro.images[0].buffer and pro.images[0].data exist
          if (pro.images[0].image.data.data) {
            pro['imageSrc'] = this.imageService.bufferToImage(
              pro.images[0].image.data.data,
              pro.images[0].image.contentType
            );
            alert(pro['imageSrc']);
          }
        }
      });
    });
  }

  saveProduct() {}
  openNew() {
    this.submitted = false;
    this.productDialog = true;
  }
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter(
          (val) => !this.selectedProducts?.includes(val)
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      // message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.products = this.products.filter((val) => val.id !== product.id);
        // this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  getSeverity(status: string) {
    switch (status) {
      case 'Active':
        return 'success';
      case 'In':
        return 'danger';
      default:
        return 'warning';
    }
  }
}
