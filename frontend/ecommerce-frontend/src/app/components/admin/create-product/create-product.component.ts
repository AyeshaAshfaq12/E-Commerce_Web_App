import { CdkStepper } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  currentStep: number = 1;
  maxStep: number = 2;
  nextStep() {
    if (this.currentStep < this.maxStep) this.currentStep += 1;
  }
}
