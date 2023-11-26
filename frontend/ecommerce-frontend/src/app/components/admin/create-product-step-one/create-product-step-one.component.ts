import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import Product from 'Models/product';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

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
  @Output() nextClicked = new EventEmitter<string>();
  productForm: FormGroup;
  categoryForm: FormGroup;
  stockForm: FormGroup;
  tagForm: FormGroup;
  @Input() product: Product | undefined;
  productError: String = '';
  position: string = 'top';
  showNewCategory: boolean = false;
  showNewTag: boolean = false;
  showNewStock: boolean = false;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private eventEmitterService: EventEmitterService
  ) {
    this.productForm = this.formBuilder.group({
      SKU: new FormControl('', [Validators.required]),
      title: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      currentStock: new FormControl('', Validators.required),
      brand: new FormControl('', Validators.required),
      Category: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      tags: new FormControl('', Validators.required),
      description: new FormControl(
        'Ea non laborum laborum eu in incididunt sint commodo amet. Excepteur minim consequat cillum dolore occaecat ex laborum laborum dolore ipsum tempor sit. In officia aute minim aute sunt id culpa ullamco tempor. Nulla Lorem pariatur laboris anim fugiat.',
        Validators.required
      ),
    });

    this.categoryForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      parentCategory: new FormControl(''),
      subcategories: new FormControl(''),
    });
    this.tagForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
    });
    this.stockForm = this.formBuilder.group({
      quantity: new FormControl('', [Validators.required]),
    });
  }

  confirmPosition(position: string, id: string) {
    this.position = position;

    this.confirmationService.confirm({
      message:
        'Product with the same SKU already exists. Do you want to update its images?',
      header: 'Image Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // User clicked "Yes" or "OK"
        this.onNextClick(id);

        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Adding Image to Existing Product',
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
    if (this.product) {
      this.isEditing = true;
      this.product?.priceHistory.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      this.productForm = this.formBuilder.group({
        SKU: new FormControl(this.product.SKU, [Validators.required]),
        title: new FormControl(this.product.title, Validators.required),
        price: new FormControl(this.product.price, Validators.required),
        discount: new FormControl(
          this.product.priceHistory[0].discount,
          Validators.required
        ),
        currentStock: new FormControl(
          this.product.currentStock,
          Validators.required
        ),
        brand: new FormControl(
          this.product.details?.['brand'],
          Validators.required
        ),
        Category: new FormControl(
          this.product.Category.name,
          Validators.required
        ),
        status: new FormControl(this.product.status, Validators.required),
        tags: new FormControl(this.product.tags, Validators.required),
        description: new FormControl(
          'Ea non laborum laborum eu in incididunt sint commodo amet. Excepteur minim consequat cillum dolore occaecat ex laborum laborum dolore ipsum tempor sit. In officia aute minim aute sunt id culpa ullamco tempor. Nulla Lorem pariatur laboris anim fugiat.',
          Validators.required
        ),
      });
    }
    // alert(this.product);
    this.statuses = ['Active', 'In Active', 'Out of Stock'];
    this.tags = [];
    // this.brands = ['B1', 'b2'];
    // this.imageInfos = this.uploadService.getFiles();
    this.loadCategories();
    this.loadBrands();
    this.loadTags();
  }

  get invalidCount(): number {
    let errorCount = 0;

    if (this.productForm.invalid) {
      // Iterate through each form control to check its validity and count the invalid ones
      Object.keys(this.productForm.controls).forEach((field) => {
        const control = this.productForm.get(field);

        if (control?.invalid) {
          errorCount += 1;
        }
      });
    }

    return errorCount;
  }
  get invalidCountNewCat(): number {
    let errorCount = 0;

    if (this.categoryForm.invalid) {
      // Iterate through each form control to check its validity and count the invalid ones
      Object.keys(this.categoryForm.controls).forEach((field) => {
        const control = this.categoryForm.get(field);

        if (control?.invalid) {
          errorCount += 1;
        }
      });
    }

    return errorCount;
  }
  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
    let product = this.updateProductData();
    // alert(JSON.stringify(product));
    if (this.isEditing && this.product?._id) {
      this.productService.updateProduct(this.product._id, product).subscribe(
        (response) => {
          console.log(response);
          this.messageService.add({
            severity: 'info',
            summary: 'Saved',
            detail: 'Product Saved Successfully',
          });
          this.eventEmitterService.triggerReload();

          this.onNextClick(response._id);
        },
        (error) => {
          switch (error.status) {
            case 409:
              console.error(error.error._id);
              alert(error.error._id);
              this.confirmPosition('top', error.error._id);

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
    } else {
      this.productService.createProduct(product).subscribe(
        (response) => {
          console.log(response);
          this.messageService.add({
            severity: 'info',
            summary: 'Saved',
            detail: 'Product Saved Successfully',
          });
          this.eventEmitterService.triggerReload();

          this.onNextClick(response._id);
        },
        (error) => {
          switch (error.status) {
            case 409:
              console.error(error.error._id);
              alert(error.error._id);
              this.confirmPosition('top', error.error._id);

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
  }
  onSubmitCat() {
    if (this.categoryForm.invalid) {
      return;
    }
    let category = this.categoryForm.getRawValue();
    this.categoryService.createCategory(category).subscribe(
      (response) => {
        console.log(response);

        this.showNewCategory = false;
        this.categories.push(response);
        this.categoriesName?.push(category.name);
        this.categoryForm.reset();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onSubmitTag() {
    // alert('y');
    if (this.tagForm.invalid) {
      return;
    }
    let tag = this.tagForm.getRawValue();

    this.showNewTag = false;
    this.tags?.push(tag.name);
    this.tagForm.reset();
  }
  onSubmitStock() {
    if (this.stockForm.invalid) {
      return;
    }
    if (this.product && this.product._id) {
      let newStock = this.stockForm.getRawValue();
      let id = this.product._id;

      this.productService.updateStock(id, newStock.quantity).subscribe(
        (response) => {
          console.log(response);
          this.productForm.get('currentStock')?.setValue(response.currentStock);
          this.showNewStock = false;
        },
        (error) => {
          console.error(error);
        }
      );
    }
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
  loadBrands() {
    this.productService.getBrands().subscribe(
      (response) => {
        this.brands = response;
        // this.categoriesName = response.map((brand: any) => ({
        //   label: brand,
        //   value: brand,
        // }));
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }
  loadTags() {
    this.productService.getTags().subscribe(
      (response) => {
        this.tags = response;
        // this.categoriesName = response.map((tag: any) => ({
        //   label: tag,
        //   value: tag,
        // }));
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  updateProductData() {
    let product = this.productForm.getRawValue();

    console.error(product);
    const categoryFormControl = this.productForm.get('Category');

    const selectedCategory = this.categories.find(
      (category: { name: any }) => category.name === categoryFormControl?.value
    );

    const idValue = selectedCategory?._id;
    if (product && product.Category) {
      product.Category = idValue;
    }
    product['details'] = { brand: product.brand };
    product['priceHistory'] = this.product?.priceHistory;
    if (product['priceHistory'] && product['priceHistory'].length > 0) {
      product['priceHistory'].push({
        price: product.price,
        discount: product.discount,
        date: Date.now(),
      });
    } else {
      product['priceHistory'] = [
        {
          price: product.price,
          discount: product.discount,
          date: Date.now(),
        },
      ];
    }

    return product;
  }

  skipNext() {
    if (this.product && this.product?._id) {
      this.onNextClick(this.product._id);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cancelled',
        detail: 'Invalid Id',
      });
    }
  }

  onNextClick(id: string) {
    this.nextClicked.emit(id);
  }
  newCategory() {
    this.showNewCategory = true;
    // alert(this.showNewCategory);
  }
  newStock() {
    this.showNewStock = true;
    // alert(this.showNewCategory);
  }
  closeCategory() {
    this.showNewCategory = false;
    this.categoryForm.reset;
    // alert(this.showNewCategory);
  }
  closeStock() {
    this.showNewStock = false;
    this.stockForm.reset;
    // alert(this.showNewCategory);
  }
  newTag() {
    this.showNewTag = true;
    // alert(this.showNewCategory);
  }
  closeTag() {
    this.showNewTag = false;
    this.tagForm.reset;
    // alert(this.showNewCategory);
  }
}
