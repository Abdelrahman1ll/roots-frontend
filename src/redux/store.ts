import { configureStore } from "@reduxjs/toolkit";
import { ApiUsers } from "../redux/users/apiUsers";
import { ApiProducts } from "./products/apiProducts";
import { ApiReviews } from "./reviews/apiReviews";
import { ApiWishlist } from "./wishlist/apiWishlist";
import { ApiDiscountCodes } from "./DiscountCodes/apiDiscountCodes";
import { ApiDelivery } from "./Delivery/apiDelivery";
import { ApiCart } from "./Cart/apiCart";
import { ApiEmailOrderDispatcher } from "./EmailOrderDispatcher/apiEmailOrderDispatcher";
import { ApiEmail } from "./Email/apiEmail";
import { ApiOrders } from "./Orders/apiOrders";
import { paymentApi } from "./Payment/apiPayment";
import { ApiCategory } from "./category/apiCategory";
import { ApiColor } from "./color/apiColor";
export const store = configureStore({
  reducer: {
    [ApiUsers.reducerPath]: ApiUsers.reducer,
    [ApiProducts.reducerPath]: ApiProducts.reducer,
    [ApiReviews.reducerPath]: ApiReviews.reducer,
    [ApiWishlist.reducerPath]: ApiWishlist.reducer,
    [ApiDiscountCodes.reducerPath]: ApiDiscountCodes.reducer,
    [ApiDelivery.reducerPath]: ApiDelivery.reducer,
    [ApiCart.reducerPath]: ApiCart.reducer,
    [ApiEmailOrderDispatcher.reducerPath]: ApiEmailOrderDispatcher.reducer,
    [ApiEmail.reducerPath]: ApiEmail.reducer,
    [ApiOrders.reducerPath]: ApiOrders.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [ApiCategory.reducerPath]: ApiCategory.reducer,
    [ApiColor.reducerPath]: ApiColor.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ApiUsers.middleware,
      ApiProducts.middleware,
      ApiReviews.middleware,
      ApiWishlist.middleware,
      ApiDiscountCodes.middleware,
      ApiDelivery.middleware,
      ApiCart.middleware,
      ApiEmailOrderDispatcher.middleware,
      ApiEmail.middleware,
      ApiOrders.middleware,
      paymentApi.middleware,
      ApiCategory.middleware,
      ApiColor.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
