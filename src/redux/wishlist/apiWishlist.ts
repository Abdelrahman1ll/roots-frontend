import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiWishlist: Product wishlist management.
 * واجهة برمجة المفضلات: إدارة قائمة المنتجات المفضلة للمستخدم.
 */
export const ApiWishlist = createApi({
  reducerPath: "apiWishlist",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: "/wishlist/user",
        method: "GET",
      }),
    }),
    postWishlist: builder.mutation({
      query: (data) => ({
        url: "/wishlist",
        method: "POST",
        body: data,
      }),
    }),
    deleteWishlist: builder.mutation({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),
    }),
    getOwnerWishlist: builder.query({
      query: () => ({
        url: "/wishlist/owner",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetWishlistQuery,
  usePostWishlistMutation,
  useDeleteWishlistMutation,
  useGetOwnerWishlistQuery,
} = ApiWishlist;
