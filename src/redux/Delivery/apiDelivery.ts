import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiDelivery: Redux Toolkit API slice for delivery management.
 * شريحة واجهة برمجة تطبيقات التوصيل للعمليات المتعلقة بإدارة تكاليف الشحن.
 */
export const ApiDelivery = createApi({
  reducerPath: "apiDelivery",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /**
     * Fetches current delivery prices and rules.
     * جلب أسعار وقواعد التوصيل الحالية.
     */
    getDelivery: builder.query({
      query: () => "/delivery",
    }),

    /**
     * Updates delivery price settings (Admin/Owner restricted).
     * تحديث إعدادات أسعار التوصيل (مقتصر على المدير/المالك).
     */
    postDelivery: builder.mutation({
      query: (data) => ({
        url: "/delivery",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Toggles global free delivery status.
     * تبديل حالة التوصيل المجاني العام.
     */
    postFreeDelivery: builder.mutation({
      query: () => ({
        url: "/delivery/free-delivery",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetDeliveryQuery,
  usePostDeliveryMutation,
  usePostFreeDeliveryMutation,
} = ApiDelivery;
