import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiReviews: Product reviews and ratings.
 * واجهة برمجة التقييمات: إدارة مراجعات وتقييمات المنتجات.
 */
export const ApiReviews = createApi({
  reducerPath: "apiReviews",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    postReviews: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
    }),
    getReviews: builder.query({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "GET",
      }),
    }),
    patchReviews: builder.mutation({
      query: ({ data, id }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteReviews: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  usePostReviewsMutation,
  useGetReviewsQuery,
  usePatchReviewsMutation,
  useDeleteReviewsMutation,
} = ApiReviews;
