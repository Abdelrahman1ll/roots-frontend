import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiEmailOrderDispatcher: Automated order email dispatcher rules.
 * واجهة برمجة منسق بريد الطلبات: إدارة قواعد إرسال بريد الطلبات الآلي.
 */
export const ApiEmailOrderDispatcher = createApi({
  reducerPath: "apiEmailOrderDispatcher",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    postEmailOrderDispatcher: builder.mutation({
      query: (data) => ({
        url: "/email-order-dispatcher",
        method: "POST",
        body: data,
      }),
    }),
    getEmailOrderDispatcher: builder.query({
      query: () => ({
        url: "/email-order-dispatcher",
        method: "GET",
      }),
    }),
    patchEmailOrderDispatcher: builder.mutation({
      query: ({ data, id }) => ({
        url: `/email-order-dispatcher/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteEmailOrderDispatcher: builder.mutation({
      query: (id) => ({
        url: `/email-order-dispatcher/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  usePostEmailOrderDispatcherMutation,
  useGetEmailOrderDispatcherQuery,
  usePatchEmailOrderDispatcherMutation,
  useDeleteEmailOrderDispatcherMutation,
} = ApiEmailOrderDispatcher;
