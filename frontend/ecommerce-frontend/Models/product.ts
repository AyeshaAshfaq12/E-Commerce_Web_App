interface PriceHistory {
  price: number;
  discount: number;
  date: Date;
}

interface InventoryHistory {
  stock: number;
  date: Date;
}

interface Review {
  customer: string;
  reviewText: string;
  rating: number;
  date: Date;
}
interface Images {
  name: string;
  image: Image;
  rating: number;
  date: Date;
}
interface Data {
  data: ArrayBuffer;
}
interface Image {
  // buffer: ArrayBuffer;
  data: Data;
  contentType: string;
}
interface category {
  name: string;
}

interface Product {
  SKU: string;
  title: string;
  slug?: string;
  description: string;
  details: Record<string, unknown>;
  totalReviews: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  currentStock: number;
  averageReview: number;
  priceHistory: PriceHistory[];
  Category: category; // Change
  tags: string[];
  inventoryHistory: InventoryHistory[];
  images: Images[]; // Change
  reviews: Review[];
  imageSrc?: String;
  price?: Number;
}

export default Product;
