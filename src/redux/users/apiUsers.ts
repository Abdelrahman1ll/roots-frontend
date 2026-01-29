import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";
/**
 * ApiUsers: Redux Toolkit API slice for user-related operations.
 * شريحة واجهة برمجة تطبيقات مستخدمي Redux Toolkit للعمليات المتعلقة بالمستخدم.
 */
export const ApiUsers = createApi({
  reducerPath: "apiUsers",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /**
     * Checks if an email is already registered.
     * التحقق مما إذا كان البريد الإلكتروني مسجلاً بالفعل.
     */
    UsersCheckEmail: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/users/check-email",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Creates a new user after email verification.
     * إنشاء مستخدم جديد بعد التحقق من البريد الإلكتروني.
     */
    PostUsers: builder.mutation({
      query: (data: { email: string; code: number }) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Handles user signup/login via Google.
     * معالجة تسجيل الدخول أو الاشتراك عبر جوجل.
     */
    UsersSignupGoogle: builder.mutation({
      query: (data) => ({
        url: "/users/signup-google",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Fetches the current user's details.
     * جلب تفاصيل المستخدم الحالي.
     */
    GetUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),

    /**
     * Updates user profile information.
     * تحديث بيانات الملف الشخصي للمستخدم.
     */
    PatchUsersById: builder.mutation({
      query: ({ data, id }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    /**
     * Updates a user's role or status (Owner/Admin restricted).
     * تحديث دور المستخدم أو حالته (مقتصر على المالك/المدير).
     */
    PatchUsersOwnerById: builder.mutation({
      query: ({ data, id }) => ({
        url: `/users/owner/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  usePatchUsersByIdMutation,
  usePatchUsersOwnerByIdMutation,
  usePostUsersMutation,
  useUsersCheckEmailMutation,
  useUsersSignupGoogleMutation,
} = ApiUsers;
