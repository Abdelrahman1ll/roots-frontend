import type { ProductType } from "./ProductType";
import type { UserType } from "./UserType";

export type ReviewType = {
    id: number;
    rating: number;
    comment: string;
    product: ProductType;
    user: UserType;
    createdAt: string;
};