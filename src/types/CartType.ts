import type { ProductType } from "./ProductType";

export interface CartSizeType {
  id: number;
  size: string;
  length: number;
  width: number;
  stock: number;
}

export interface CartItemType {
  id: number;
  quantity: number;
  sizes: CartSizeType;
  product: ProductType;
  createdAt: string;
}

export type CartResponse = CartItemType[];
