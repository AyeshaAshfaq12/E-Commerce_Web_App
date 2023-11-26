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
interface ImagesToUpload {
  image?: Images;
  name?: string;
  file?: File;
}
interface Images {
  _id?: string;
  url: string;
  public_id?: string;
  // rating: number;
  // date: Date;
}
interface Data {
  data: ArrayBuffer;
}
interface Image {
  // buffer: ArrayBuffer;
  data: any;
  contentType: string;
}
interface category {
  name: string;
}

interface Product {
  _id?: string;
  id?: string;
  SKU: string;
  title: string;
  slug?: string;
  description: string;
  details: Record<string, unknown>;
  totalReviews: number;
  status:
    | 'Active'
    | 'In Active'
    | 'Out of Stock'
    | 'In Stock'
    | 'Not Visible to Customers';
  currentStock: number;
  averageReview: number;
  priceHistory: PriceHistory[];
  Category: category; // Change
  tags: string[];
  inventoryHistory: InventoryHistory[];
  images: Images[]; // Change
  reviews: Review[];
  imageSrc?: String;
  price?: number;
  discountedPrice?: number;
}

export default Product;
export {
  Images,
  PriceHistory,
  InventoryHistory,
  Review,
  Data,
  Image,
  category,
  ImagesToUpload,
};
