import type { DiscountCodeType } from "./DiscountCodeType";
import type { ProductSizeType, ProductType } from "./ProductType";
import type { UserType } from "./UserType";

type AddressType = {
  address: string;
  city: string;
  country: string;
  fullName: string;
  lastName: string;
  phone: string;
  phoneOptional?: string;
};

type OrderItemType = {
  id: number;
  product: ProductType;
  sizes: ProductSizeType;
  quantity: number;
  price: number;
};
export type OrderType = {
  id: number;
  orderNumber: number;
  user: UserType;
  addresses: AddressType;
  items: OrderItemType[];
  totalPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  isConfirmed: boolean;
  isShipped: boolean;
  isDelivered: boolean;
  isCanceled: boolean;
  discountCode?: DiscountCodeType;
  deliveryPrice: number;
  paymentId: string;
  createdAt: string;
};

export type OrdersType = {
  orders: OrderType[];
  count: number;
};
