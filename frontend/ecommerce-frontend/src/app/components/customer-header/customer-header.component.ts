import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.css'],
})
export class CustomerHeaderComponent {
  isOpenAvatar: boolean = false;
  toggleAvatar() {
    this.isOpenAvatar = !this.isOpenAvatar;
  }
}
