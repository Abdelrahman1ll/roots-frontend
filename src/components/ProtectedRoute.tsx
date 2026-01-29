import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles: ("owner" | "admin" | "user")[];
};

/**
 * ProtectedRoute component restricts access to certain pages based on authentication state and user roles.
 * مكون ProtectedRoute يتحكم في الوصول لصفحات معينة بناءً على حالة تسجيل الدخول ودور المستخدم.
 */
export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const { user, initializing } = useContext(AuthContext);
  const location = useLocation();

  // If the auth state is still charging, show nothing (or a loader)
  // إذا كانت حالة المصادقة قيد التحميل، لا تظهر شيئاً
  if (initializing) {
    return null;
  }

  // If no user is authenticated, redirect to home and save the attempted location
  // إذا لم يكن المستخدم مسجلاً، قم بتحويله للرئيسية مع حفظ المكان الذي كان يحاول دخوله
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If user role is not among the allowed roles, redirect back to home
  // إذا كان دور المستخدم غير مسموح له، قم بإرجاعه للرئيسية
  if (
    !roles
      .map((r) => r.toLowerCase())
      .includes(user.role.toLowerCase() as "owner" | "admin" | "user")
  ) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  // إذا مرت كل الفحوصات بنجاح، اعرض المحتوى المحمي

  return <>{children}</>;
}
