import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import {
  useGetOwnerOrdersQuery,
  useGetAdminOrdersQuery,
  useGetUserOrdersQuery,
} from "../../redux/Orders/apiOrders";
import { toast } from "react-toastify";
import { formatEndDateArabic } from "../../utils/formatters";

import type { OrderType } from "../../types/OrderType";

/**
 * useOrders: Fetches and manages orders based on user role (user/admin/owner).
 * خطاف الطلبات: جلب وإدارة الطلبات حسب دور المستخدم (مستخدم/أدمن/مالك).
 */
export default function useOrders() {
  const { user } = useContext(AuthContext);
  const role = user?.role || "";

  // استدعاء كل الـ hooks — لازم يكون برا الشروط
  const { data: ownerOrders, isLoading: isOwnerOrdersLoading } =
    useGetOwnerOrdersQuery(undefined, { skip: role !== "owner" });
  const { data: userOrders, isLoading: isUserOrdersLoading } =
    useGetUserOrdersQuery(undefined, { skip: role !== "user" });
  const { data: adminOrders, isLoading: isAdminOrdersLoading } =
    useGetAdminOrdersQuery(undefined, { skip: role !== "admin" });

  // تحديد الـ orders بناء على الـ role
  let orders: OrderType[] = [];
  let isLoading: boolean = false;
  if (role === "owner") {
    orders = ownerOrders?.orders || [];
    isLoading = isOwnerOrdersLoading;
  } else if (role === "user") {
    orders = userOrders?.orders || [];
    isLoading = isUserOrdersLoading;
  } else if (role === "admin") {
    orders = adminOrders?.orders || [];
    isLoading = isAdminOrdersLoading;
  } else if (user) {
    toast.error("You are not authorized to view this page.");
  }
  return { orders, isLoading, formatEndDateArabic };
}
