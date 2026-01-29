import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiColor: Product color management.
 * واجهة برمجة الألوان: إدارة ألوان المنتجات.
 */
export const ApiColor = createApi({
  reducerPath: "apiColor",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getColors: builder.query({
      query: () => "/color",
    }),
    postColor: builder.mutation({
      query: (data) => ({
        url: "/color",
        method: "POST",
        body: data,
      }),
    }),
    patchColor: builder.mutation({
      query: ({ data, id }) => ({
        url: `/color/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/color/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetColorsQuery,
  usePostColorMutation,
  usePatchColorMutation,
  useDeleteColorMutation,
} = ApiColor;
