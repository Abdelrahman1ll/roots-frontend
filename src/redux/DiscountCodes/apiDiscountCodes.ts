import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

/**
 * ApiDiscountCodes: Redux Toolkit API slice for discount code operations.
 * شريحة واجهة برمجة تطبيقات أكواد الخصم للعمليات المتعلقة بالعروض والخصومات.
 */
export const ApiDiscountCodes = createApi({
  reducerPath: "apiDiscountCodes",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /**
     * Fetches all available discount codes (Admin/Owner restricted).
     * جلب كافة أكواد الخصم المتاحة (مقتصر على المدير/المالك).
     */
    GetDiscountCodes: builder.query({
      query: () => ({
        url: "/discount-codes",
        method: "GET",
      }),
    }),

    /**
     * Validates a discount code for the current user.
     * التحقق من صحة كود الخصم للمستخدم الحالي.
     */
    PostValidateDiscountCode: builder.mutation({
      query: (data) => ({
        url: "/discount-codes/user",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Creates a new discount code.
     * إنشاء كود خصم جديد.
     */
    PostDiscountCodes: builder.mutation({
      query: (data) => ({
        url: "/discount-codes",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Updates an existing discount code.
     * تحديث كود خصم موجود.
     */
    PatchDiscountCodes: builder.mutation({
      query: ({ data, id }) => ({
        url: `/discount-codes/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    /**
     * Deletes a discount code.
     * حذف كود خصم.
     */
    DeleteDiscountCodes: builder.mutation({
      query: (id) => ({
        url: `/discount-codes/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDiscountCodesQuery,
  usePostDiscountCodesMutation,
  usePatchDiscountCodesMutation,
  useDeleteDiscountCodesMutation,
  usePostValidateDiscountCodeMutation,
} = ApiDiscountCodes;
