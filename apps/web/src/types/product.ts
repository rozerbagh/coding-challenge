export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CreateEnquiryRequest {
  productId: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface EnquiryResponse {
  message: string;
}
