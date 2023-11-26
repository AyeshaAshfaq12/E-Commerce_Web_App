import { CdkStepper } from '@angular/cdk/stepper';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Product from 'Models/product';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  _id: string = '';
  closeClicked: EventEmitter<any> = new EventEmitter<any>();
  // @Output() closeClicked = new EventEmitter<void>();
  @Input() product!: Product;
  currentStep: number = 1;
  maxStep: number = 2;
  ngOnInit() {
    // alert(this.product);
  }
  nextStep(id: string) {
    this._id = id;

    // alert(id + 'sUBHSN');
    if (this.currentStep < this.maxStep) {
      this.currentStep += 1;
    } else {
      this.closeClicked.emit();
    }
  }
}
