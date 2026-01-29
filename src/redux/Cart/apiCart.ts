import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiCart: Redux Toolkit API slice for shopping cart operations.
 * شريحة واجهة برمجة تطبيقات سلة التسوق للعمليات المتعلقة بإدارة المنتجات المختارة.
 */
export const ApiCart = createApi({
  reducerPath: "apiCart",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    /**
     * Fetches the current user's shopping cart.
     * جلب سلة التسوق الخاصة بالمستخدم الحالي.
     */
    getCart: builder.query({
      query: () => "/carts",
      providesTags: ["Cart"],
    }),

    /**
     * Fetches cart details for the business owner (Admin usage).
     * جلب تفاصيل السلة لمالك المتجر (لأغراض إدارية).
     */
    getOwnerCart: builder.query({
      query: () => "/carts/owner",
    }),

    /**
     * Adds an item to the shopping cart.
     * إضافة منتج إلى سلة التسوق.
     */
    postCart: builder.mutation({
      query: (data) => ({
        url: "/carts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    /**
     * Updates an item's quantity or details in the cart.
     * تحديث كمية أو تفاصيل منتج في السلة.
     */
    patchCart: builder.mutation({
      query: ({ data, id }) => ({
        url: `/carts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    /**
     * Removes an item from the shopping cart.
     * حذف منتج من سلة التسوق.
     */
    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/carts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useGetOwnerCartQuery,
  usePostCartMutation,
  usePatchCartMutation,
  useDeleteCartMutation,
} = ApiCart;
