import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWishlistComponent } from './product-wishlist.component';

describe('ProductWishlistComponent', () => {
  let component: ProductWishlistComponent;
  let fixture: ComponentFixture<ProductWishlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductWishlistComponent]
    });
    fixture = TestBed.createComponent(ProductWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
