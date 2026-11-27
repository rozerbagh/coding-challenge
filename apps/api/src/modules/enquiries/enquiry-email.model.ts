import { Product } from '../products/product.model';

export interface EnquiryCustomer {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface EnquiryEmail {
  product: Product;
  customer: EnquiryCustomer;
}
