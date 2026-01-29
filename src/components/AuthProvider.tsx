import { useState, useEffect, type ReactNode } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import type { UserType } from "../types/UserType";
import {
  AuthContext,
  type AuthData,
  type SetUserPayload,
} from "../context/AuthContext";

/**
 * AuthProvider component that wraps the application and provides the auth state.
 * مكون مزود المصادقة الذي يحيط بالتطبيق ويوفر حالة المصادقة.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, _setUser] = useState<UserType | null>(null);
  const [initializing, setInitializing] = useState(true);

  const secretKey =
    import.meta.env.VITE_SECRET_KEY || "fallback_secret_key_dev_only";

  if (!import.meta.env.VITE_SECRET_KEY && import.meta.env.DEV) {
    console.warn(
      "VITE_SECRET_KEY is missing in environment variables! Using dev fallback."
    );
  }

  /**
   * Sets the user state and persists it to an encrypted cookie.
   * It handles full login responses (user + tokens) and partial user profile updates.
   * وظيفة تحديث بيانات المستخدم وتخزينها مشفرة في الكوكيز.
   * تتعامل مع استجابة تسجيل الدخول الكاملة وتحديثات الملف الشخصي الجزئية.
   */
  const setUser = (data: SetUserPayload) => {
    if (!data) {
      _setUser(null);
      Cookies.remove("user");
      return;
    }

    // Check if it's a full auth response or just a user object
    // التحقق مما إذا كانت هذه استجابة كاملة للمصادقة أم مجرد بيانات مستخدم
    const isFullResponse = !!(
      data &&
      typeof data === "object" &&
      "accessToken" in data &&
      "user" in data
    );
    const userData = isFullResponse
      ? (data as AuthData).user
      : (data as UserType);

    _setUser(userData);

    // Prepare cookie data
    // تجهيز البيانات لحفظها في الكوكيز
    let cookieData: SetUserPayload;
    if (isFullResponse) {
      cookieData = data;
    } else {
      // If updating user only, merge with existing cookie to preserve tokens
      // في حالة تحديث بيانات المستخدم فقط، نقوم بدمجها مع البيانات الحالية للحفاظ على التوكنز
      const encryptedUser = Cookies.get("user");
      if (encryptedUser) {
        try {
          const decrypted = CryptoJS.AES.decrypt(
            encryptedUser,
            secretKey
          ).toString(CryptoJS.enc.Utf8);
          const existing = JSON.parse(decrypted);
          cookieData = { ...existing, user: userData };
        } catch {
          cookieData = { user: userData };
        }
      } else {
        cookieData = { user: userData };
      }
    }

    // Encrypt coordinates data for security
    // تشفير البيانات المجمعة لضمان الأمان
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(cookieData),
      secretKey
    ).toString();

    // Save to cookies with a 90-day expiry
    // حفظ في الكوكيز بمدة انتهاء 90 يوماً
    Cookies.set("user", encrypted, {
      expires: 90,
      secure: import.meta.env.VITE_NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  };

  /**
   * Clears the user state and removes authentication cookies.
   * وظيفة تسجيل الخروج، تقوم بمسح حالة المستخدم وحذف الكوكيز.
   */
  const logout = () => {
    _setUser(null);
    Cookies.remove("user");
  };

  /**
   * Effect hook to initialize the auth state from cookies on application load.
   * تأثير برمجي عند تحميل التطبيق لاستعادة حالة المصادقة من الكوكيز.
   */
  useEffect(() => {
    const encryptedUser = Cookies.get("user");
    if (encryptedUser) {
      try {
        // Attempt to decrypt and parse the user data
        // محاولة فك التشفير وقراءة بيانات المستخدم
        const bytes = CryptoJS.AES.decrypt(encryptedUser, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const parsed = JSON.parse(decrypted);
        if (parsed?.user) {
          _setUser(parsed.user);
        } else if (parsed?.role) {
          // Backward compatibility if cookie was just a user object
          // دعم النسخ القديمة إذا كانت الكوكي تحتوي على بيانات المستخدم مباشرة
          _setUser(parsed);
        } else {
          _setUser(null);
        }
      } catch (error) {
        console.error("Failed to decrypt auth cookie:", error);
        _setUser(null);
      }
    } else {
      _setUser(null);
    }

    setInitializing(false); // Auth check is complete | اكتملت عملية التحقق
  }, [secretKey]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}
