import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";
import type { OrdersType } from "../../types/OrderType";

/**
 * ApiOrders: Redux Toolkit API slice for order-related operations.
 * شريحة واجهة برمجة تطبيقات الطلبات للعمليات المتعلقة بالشراء والطلبات.
 */
export const ApiOrders = createApi({
  reducerPath: "apiOrders",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /**
     * Places a new order.
     * إنشاء طلب جديد.
     */
    postOrders: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Fetches orders for the business owner.
     * جلب الطلبات الخاصة بمالك المتجر.
     */
    getOwnerOrders: builder.query<OrdersType, void>({
      query: () => ({
        url: "/orders/owner",
        method: "GET",
      }),
    }),

    /**
     * Fetches orders for the main dashboard display.
     * جلب الطلبات للعرض في لوحة التحكم الأساسية.
     */
    getDashboardOrders: builder.query({
      query: () => ({
        url: "/orders/dashboard",
        method: "GET",
      }),
    }),

    /**
     * Fetches orders for administrators.
     * جلب الطلبات الخاصة بالمديرين (أدمن).
     */
    getAdminOrders: builder.query<OrdersType, void>({
      query: () => ({
        url: "/orders/admin",
        method: "GET",
      }),
    }),

    /**
     * Fetches orders for the currently authenticated user.
     * جلب الطلبات الخاصة بالمستخدم الحالي المسجل دخوله.
     */
    getUserOrders: builder.query<OrdersType, void>({
      query: () => ({
        url: "/orders/user",
        method: "GET",
      }),
    }),

    /**
     * Marks an order as paid.
     * وضع علامة "تم الدفع" على الطلب.
     */
    patchIsPaidOrders: builder.mutation({
      query: (id) => ({
        url: `/orders/isPaid/${id}`,
        method: "PATCH",
      }),
    }),

    /**
     * Marks an order as confirmed.
     * وضع علامة "تم التأكيد" على الطلب.
     */
    patchIsConfirmedOrders: builder.mutation({
      query: (id) => ({
        url: `/orders/isConfirmed/${id}`,
        method: "PATCH",
      }),
    }),

    /**
     * Marks an order as shipped.
     * وضع علامة "تم الشحن" على الطلب.
     */
    patchIsShippedOrders: builder.mutation({
      query: (id) => ({
        url: `/orders/isShipped/${id}`,
        method: "PATCH",
      }),
    }),

    /**
     * Marks an order as canceled.
     * وضع علامة "ملغي" على الطلب.
     */
    patchIsCanceledOrders: builder.mutation({
      query: (id) => ({
        url: `/orders/isCanceled/${id}`,
        method: "PATCH",
      }),
    }),

    /**
     * Marks an order as delivered.
     * وضع علامة "تم التوصيل" على الطلب.
     */
    patchIsDeliveredOrders: builder.mutation({
      query: (id) => ({
        url: `/orders/isDelivered/${id}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  usePostOrdersMutation,
  useGetOwnerOrdersQuery,
  useGetDashboardOrdersQuery,
  useGetAdminOrdersQuery,
  useGetUserOrdersQuery,
  usePatchIsPaidOrdersMutation,
  usePatchIsConfirmedOrdersMutation,
  usePatchIsShippedOrdersMutation,
  usePatchIsCanceledOrdersMutation,
  usePatchIsDeliveredOrdersMutation,
} = ApiOrders;
