import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { SignupProvider } from "./components/Signup/SignupProvider.tsx";
import GlobalSignup from "./components/Signup/GlobalSignup.tsx";

// Main entry point for the React application
// نقطة الانطلاق الرئيسية لتطبيق ريأكت
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Redux Store Provider: Manages global state - مدير الحالة العامة للمشروع */}
    <Provider store={store}>
      {/* Browser Router: Handles page navigation - مدير التنقل بين الصفحات */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        {/* Google OAuth: Enables Google Login - تفعيل تسجيل الدخول بجوجل */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          {/* Auth Provider: Manages user authentication state - مدير حالة تسجيل دخول المستخدم */}
          <AuthProvider>
            {/* Signup Provider: Manages registration flows - مدير عمليات إنشاء الحساب */}
            <SignupProvider>
              <App />
              {/* Global Signup: Displays signup modal anywhere - عرض نافذة التسجيل في أي مكان */}
              <GlobalSignup />
            </SignupProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
