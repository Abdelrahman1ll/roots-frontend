import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiCategory: Category management.
 * واجهة برمجة الفئات: إدارة الأقسام والفئات.
 */
export const ApiCategory = createApi({
  reducerPath: "apiCategory",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: () => "/category",
    }),
    postCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),
    }),
    patchCategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoryQuery,
  usePostCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,
} = ApiCategory;
