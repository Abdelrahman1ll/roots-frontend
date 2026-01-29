import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * Payment API: Handling payment session initialization.
 * واجهة برمجة الدفع: تهيئة جلسة الدفع الإلكتروني.
 */
export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    postPayment: builder.mutation({
      query: (data) => ({
        url: "/payment/init-payment",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostPaymentMutation } = paymentApi;
