import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UIProvider } from "./context/UIContext";
import CartDrawer from "./components/Cart/CartDrawer";

const CategoryPage = lazy(() => import("./pages/Category/categoryPage"));

const ColorPage = lazy(() => import("./pages/Color/colorPage"));

const Loading = lazy(() => import("./components/Loading"));
const NetworkStatus = lazy(() => import("./components/NetworkStatus"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const AboutUsPage = lazy(() => import("./pages/QuickLinks/aboutUsPage"));
const FAQsPage = lazy(() => import("./pages/QuickLinks/FAQsPage"));
const ShippingDeliveryPage = lazy(
  () => import("./pages/QuickLinks/ShippingDeliveryPage"),
);
const SecurePaymentPage = lazy(
  () => import("./pages/QuickLinks/SecurePaymentPage"),
);
const WorldwideShippingPage = lazy(
  () => import("./pages/QuickLinks/WorldwideShippingPage"),
);

const HomePage = lazy(() => import("./pages/Home/homePage"));
const ProductsPage = lazy(() => import("./pages/products/productPage"));
const ProductDetailsPage = lazy(
  () => import("./pages/products/productDetailsPage"),
);
const ReviewsPage = lazy(() => import("./pages/products/ReviewsPage"));
const WishlistPage = lazy(() => import("./pages/Wishlist/wishlistPage"));
const ProfilePage = lazy(() => import("./pages/Profile/profilePage"));
const OrdersPage = lazy(() => import("./pages/Orders/ordersPage"));
const OrderDetailsPage = lazy(() => import("./pages/Orders/orderDetailsPage"));
const AddProductPage = lazy(() => import("./pages/products/addProductPage"));
const EditProductPage = lazy(() => import("./pages/products/editProductPage"));
const AddDeliveryPage = lazy(() => import("./pages/Delivery/addDeliveryPage"));
const DiscountCodesPage = lazy(
  () => import("./pages/DiscountCodes/DiscountCodesPage"),
);
const AllUsersMessagesPage = lazy(
  () => import("./pages/AllUsersMessages/allUsersMessagesPage"),
);
const EmailOrderDispatcherPage = lazy(
  () => import("./pages/EmailOrderDispatcher/emailOrderDispatcherPage"),
);
const DashboardPage = lazy(() => import("./pages/Dashboard/dashboardPage"));
const UsersPage = lazy(() => import("./pages/Users/usersPage"));
const EditUserOwnerPage = lazy(() => import("./pages/Users/editUserOwnerPage"));
const PrivacyPolicyPage = lazy(
  () => import("./pages/Policies/privacyPolicyPage"),
);
const ReturnExchangePolicyPage = lazy(
  () => import("./pages/Policies/returnExchangePolicyPage"),
);
const SalesPaymentPolicyPage = lazy(
  () => import("./pages/Policies/salesPaymentPolicyPage"),
);
const TermsConditionsPage = lazy(
  () => import("./pages/Policies/termsConditionsPage"),
);
const CheckoutPage = lazy(() => import("./pages/Orders/CheckoutPage"));
const ContactUsPage = lazy(() => import("./pages/QuickLinks/contactUsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default /**
 * App component: The root component that defines the application routing and page structure.
 * مكون App: المكون الأساسي الذي يحدد مسارات التطبيق وهيكل الصفحات.
 */
function App() {
  /**
   * Defines the routes and protected layouts for different user roles.
   * يتم هنا تعريف المسارات والتنسيقات المحمية لكل دور مستخدم.
   */

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="premium-toast"
        className="premium-toast-body"
      />

      <UIProvider>
        <Suspense fallback={<Loading />}>
          <ScrollToTop />
          <NetworkStatus />
          <CartDrawer />

          <Routes>
            {/* 
            Home Page: The main landing page of the application.
            الصفحة الرئيسية: صفحة الهبوط الأساسية للتطبيق.
            E2E: Covered (home.spec.ts, auth.spec.ts, owner.spec.ts) 
          */}
            <Route path="/" element={<HomePage />} />

            {/* 
            Products Page: Displays a list of all available products with filters.
            صفحة المنتجات: تعرض قائمة بجميع المنتجات المتاحة مع خيارات التصفية.
            E2E: Covered (products.spec.ts, cart.spec.ts, checkout.spec.ts, owner.spec.ts, roles.spec.ts) 
          */}
            <Route path="/products" element={<ProductsPage />} />

            {/* 
            Product Details Page: Shows detailed information about a specific product.
            صفحة تفاصيل المنتج: تعرض معلومات مفصلة حول منتج معين.
            E2E: Covered (details.spec.ts, cart.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/products-details/:id"
              element={<ProductDetailsPage />}
            />
            <Route
              path="/products-details/:id/reviews"
              element={<ReviewsPage />}
            />

            {/* 
            Wishlist: Displays products saved by the user for later.
            قائمة الأمنيات: تعرض المنتجات التي حفظها المستخدم للرجوع إليها لاحقاً.
            E2E: Covered (wishlist.spec.ts, owner.spec.ts) 
          */}
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* 
            User Profile: Allows users to manage their personal information.
            الملف الشخصي: يسمح للمستخدمين بإدارة معلوماتهم الشخصية.
            E2E: Covered (profile.spec.ts, roles.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["owner", "admin", "user"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 
            Orders History: Shows a list of all orders placed by the user.
            سجل الطلبات: يعرض قائمة بجميع الطلبات التي قام بها المستخدم.
            E2E: Covered (profile.spec.ts, roles.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute roles={["owner", "admin", "user"]}>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Order Details: Shows detailed information about a specific order.
            تفاصيل الطلب: يعرض معلومات مفصلة حول طلب معين.
            E2E: Covered (details.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute roles={["owner", "admin", "user"]}>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Sales and Payment Policy: Explains terms related to sales and transactions.
            سياسة البيع والدفع: توضح الشروط المتعلقة بالمبيعات والمعاملات.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/sales-payment-policy"
              element={<SalesPaymentPolicyPage />}
            />

            {/* 
            Return and Exchange Policy: outlines the process for returns and exchanges.
            سياسة الإرجاع والاستبدال: توضح إجراءات الإرجاع والاستبدال.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/return-exchange-policy"
              element={<ReturnExchangePolicyPage />}
            />

            {/* 
            Privacy Policy: Describes how user data is handled and protected.
            سياسة الخصوصية: تصف كيفية التعامل مع بيانات المستخدم وحمايتها.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* 
            Terms and Conditions: Legal agreement for using the platform.
            الشروط والأحكام: الاتفاقية القانونية لاستخدام المنصة.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />

            {/* 
            Checkout Page: Final step for completing an order and payment.
            صفحة الدفع: الخطوة النهائية لإتمام الطلب والدفع.
            E2E: Covered (checkout.spec.ts, owner.spec.ts) 
          */}
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* 
            Contact Us: Page for users to get in touch with support.
            اتصل بنا: صفحة للمستخدمين للتواصل مع الدعم.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route path="/contact-us" element={<ContactUsPage />} />

            {/* 
            About Us: Information about the company and its mission.
            من نحن: معلومات حول الشركة ومهمتها.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route path="/about-us" element={<AboutUsPage />} />

            {/* 
            FAQs: Frequently Asked Questions and their answers.
            الأسئلة الشائعة: الأسئلة الأكثر شيوعاً وإجاباتها.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route path="/faqs" element={<FAQsPage />} />

            {/* 
            Shipping and Delivery: Details about delivery times and methods.
            الشحن والتوصيل: تفاصيل حول أوقات وطرق التوصيل.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/shipping-delivery"
              element={<ShippingDeliveryPage />}
            />

            {/* 
            Secure Payment Info: Details about secure transaction methods.
            معلومات الدفع الآمن: تفاصيل حول طرق المعاملات الآمنة.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route path="/secure-payment" element={<SecurePaymentPage />} />

            {/* 
            Worldwide/Local Shipping: Regional shipping information.
            الشحن الدولي/المحلي: معلومات الشحن الإقليمية.
            E2E: Covered (policies.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/shipping-in-egypt"
              element={<WorldwideShippingPage />}
            />

            {/* 
            404 Not Found: Fallback page for non-existent routes.
            404 الصفحة غير موجودة: صفحة احتياطية للمسارات غير الموجودة.
            E2E: Covered (notfound.spec.ts, owner.spec.ts) 
          */}
            <Route path="*" element={<NotFound />} />

            {/* 
            Edit Product (Owner/Admin): Interface for modifying product details.
            تعديل المنتج (للمالك/المسؤول): واجهة لتعديل تفاصيل المنتج.
            E2E: Covered (roles.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/edit-product/:id"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <EditProductPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Add Product (Owner): Interface for creating new products.
            إضافة منتج (للمالك): واجهة لإنشاء منتجات جديدة.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/add-product"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <AddProductPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Add Delivery (Owner): Management of delivery options and providers.
            إضافة توصيل (للمالك): إدارة خيارات ومزودي التوصيل.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/add-delivery"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <AddDeliveryPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Discount Codes (Owner): Management of promotional and discount coupons.
            أكواد الخصم (للمالك): إدارة كوبونات الخصم والترويج.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/discount-codes"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <DiscountCodesPage />
                </ProtectedRoute>
              }
            />

            {/* 
            All User Messages (Owner): Viewing and managing contact form submissions.
            جميع رسائل المستخدمين (للمالك): عرض وإدارة الرسائل الواردة من نماذج الاتصال.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/all-users-messages"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <AllUsersMessagesPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Email Order Dispatcher (Owner): Tool for managing and dispatching order emails.
            قائم بإرسال طلبات البريد (للمالك): أداة لإدارة وإرسال رسائل الطلبات بالبريد.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/email-order-dispatcher"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <EmailOrderDispatcherPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Owner Dashboard: Analytical overview and administrative statistics.
            لوحة تحكم المالك: نظرة عامة تحليلية وإحصائيات إدارية.
            E2E: Covered (roles.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 
            User Management (Owner): Viewing and managing all registered users.
            إدارة المستخدمين (للمالك): عرض وإدارة جميع المستخدمين المسجلين.
            E2E: Covered (roles.spec.ts, owner.spec.ts) 
          */}
            <Route
              path="/all-users"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Edit User (Owner): Specialized interface for editing user permissions/details.
            تعديل مستخدم (للمالك): واجهة متخصصة لتعديل صلاحيات أو تفاصيل المستخدم.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/edit-user-owner/:id"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <EditUserOwnerPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Category Management (Owner): Creating and organizing product categories.
            إدارة الأصناف (للمالك): إنشاء وتنظيم فئات المنتجات.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/category"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <CategoryPage />
                </ProtectedRoute>
              }
            />

            {/* 
            Color Management (Owner): Managing available product colors.
            إدارة الألوان (للمالك): إدارة ألوان المنتجات المتاحة.
            E2E: Covered (owner.spec.ts) 
          */}
            <Route
              path="/color"
              element={
                <ProtectedRoute roles={["owner"]}>
                  <ColorPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </UIProvider>
    </div>
  );
}
