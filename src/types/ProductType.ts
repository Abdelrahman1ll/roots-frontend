export interface ProductSizeType {
  id?: number;
  size: string;
  length: number;
  width: number;
  stock: number;
}

export interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  promotionalPrice: number;
  discountPercentage: number;
  images: string[];
  category: string;
  stock: number;
  wholesalePrice: number;
  packagingCost: number;
  marketingCosts: number;
  sold: number;
  sizes: ProductSizeType[];
  colors: string;
  totalReviews: number;
  createdAt: string;
  total_stock: number;
}
