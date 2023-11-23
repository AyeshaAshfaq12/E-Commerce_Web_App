import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-create-product-step-one',
  templateUrl: './create-product-step-one.component.html',
  styleUrls: ['./create-product-step-one.component.css'],
})
export class CreateProductStepOneComponent {
  tags: String[] | undefined;
  statuses: String[] | undefined;
  brands: String[] | undefined;
  categories: any;
  categoriesName: String[] | undefined;
  @Output() nextClicked = new EventEmitter<void>();
  productForm: FormGroup;
  product: any;
  productError: String = '';
  position: string = 'top';

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.productForm = this.formBuilder.group({
      SKU: new FormControl('ABC-12345-S-BL', [Validators.required]),
      title: new FormControl('Example Product', Validators.required),
      price: new FormControl(2500, Validators.required),
      discount: new FormControl(5, Validators.required),
      currentStock: new FormControl(100, Validators.required),
      brand: new FormControl('ABC', Validators.required),
      category: new FormControl('XYZ', Validators.required),
      status: new FormControl('Active', Validators.required),
      tags: new FormControl(this.tags, Validators.required),
      description: new FormControl(
        'Ea non laborum laborum eu in incididunt sint commodo amet. Excepteur minim consequat cillum dolore occaecat ex laborum laborum dolore ipsum tempor sit. In officia aute minim aute sunt id culpa ullamco tempor. Nulla Lorem pariatur laboris anim fugiat.',
        Validators.required
      ),
    });
  }

  confirmPosition(position: string) {
    this.position = position;

    this.confirmationService.confirm({
      message:
        'Product with the same SKU already exists. Do you want to update its images?',
      header: 'Image Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // User clicked "Yes" or "OK"
        this.onNextClick();

        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Image Update',
        });
      },
      reject: (type: ConfirmEventType) => {
        // User clicked "No" or rejected

        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
      key: 'positionDialog',
    });
  }

  ngOnInit() {
    this.tags = ['Tech and Life Style', 'T2'];
    this.statuses = ['Active', 'InActive', 'Out of Stock', 'S1'];
    this.categoriesName = ['C1', 'c2'];
    this.brands = ['B1', 'b2'];
    // this.imageInfos = this.uploadService.getFiles();
    this.loadCategories();
  }
  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
    let product = this.updateProductData();
    this.productService.createProduct(product).subscribe(
      (response) => {
        console.log(response);
        this.onNextClick();
      },
      (error) => {
        switch (error.status) {
          case 409:
            console.error(error.error._id);
            this.confirmPosition('top');

            break;
          case 500:
            this.productError = 'Request failed. Please try again later.';
            break;
          default:
            this.productError =
              'An unexpected error occurred. Please try again later or contact support.';
            break;
        }
        console.error(error);
      }
    );
  }
  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response;
        this.categoriesName = response.map((category: any) => ({
          label: category.name,
          value: category.name,
        }));
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  updateProductData() {
    let product = this.productForm.getRawValue();

    console.error(product);
    const categoryFormControl = this.productForm.get('category');

    const selectedCategory = this.categories.find(
      (category: { name: any }) => category.name === categoryFormControl?.value
    );

    const idValue = selectedCategory?._id;
    if (product && product.category) {
      product.category = idValue;
    }
    product['details'] = {};
    product['priceHistory'] = [
      {
        price: product.price,
        discount: product.discount,
        date: Date.now(),
      },
    ];
    return product;
  }

  onNextClick() {
    this.nextClicked.emit();
  }
}
