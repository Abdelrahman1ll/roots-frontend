import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";
/**
 * ApiProducts: Logic for fetching and managing products.
 * واجهة برمجة تطبيقات المنتجات: جلب وإدارة بيانات المنتجات.
 */
export const ApiProducts = createApi({
  reducerPath: "apiProducts",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Get list of products | جلب قائمة المنتجات
    GetProducts: builder.query({
      query: (url) => ({
        url,
        method: "GET",
      }),
    }),
    // Get single product details | جلب تفاصيل منتج معين
    GetProductId: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    }),
    // Create new product (Admin) | إنشاء منتج جديد
    PostProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
    }),
    // Update product (Admin) | تحديث بيانات منتج
    PatchProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductIdQuery,
  usePostProductMutation,
  usePatchProductMutation,
} = ApiProducts;
