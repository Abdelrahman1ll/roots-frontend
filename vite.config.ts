/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

// Main configuration for Vite
// الملف الرئيسي لإعدادات Vite
export default defineConfig(({ mode }) => {
  // Load environment variables based on current mode (dev/production)
  // تحميل متغيرات البيئة بناءً على وضع التشغيل (تطوير أو إنتاج)
  const env = loadEnv(mode, process.cwd(), "");

  // Shared security headers for enhanced protection and Lighthouse scores
  // إعدادات الأمان المشتركة لتحسين الحماية وتقييم المتصفح والأداء
  const securityHeaders = {
    // Prevent site from being displayed in frames (Clickjacking protection) - منع عرض الموقع داخل إطارات لحمايته
    "X-Frame-Options": "SAMEORIGIN",
    // Stop browser from guessing MIME types - منع المتصفح من تخمين أنواع الملفات
    "X-Content-Type-Options": "nosniff",
    // Control referrer information sent when clicking links - التحكم في البيانات المرسلة مع الروابط
    "Referrer-Policy": "strict-origin-when-cross-origin",
    // Disable access to sensitive browser features (camera, mic) - منع الوصول للصلاحيات الحساسة (كاميرا، ميكروفون)
    "Permissions-Policy": "geolocation=(self), microphone=(), camera=()",
    // Content Security Policy (CSP): Protect against XSS and data injection
    // سياسة أمان المحتوى: حماية الموقع من هجمات حقن الأكواد الضارة (XSS)
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://cdn.jsdelivr.net https://js.stripe.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https: blob:; connect-src 'self' https://accounts.google.com https://*.cloudinary.com https://*.paymob.com https://api.stripe.com https://formspree.io https://api.bigdatacloud.net ws: wss:; frame-src 'self' https://accounts.google.com https://*.paymob.com https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; worker-src 'self' blob:; media-src 'self' data:;",
  };

  return {
    // List of plugins to enhance Vite functionality
    // قائمة الإضافات (Plugins) لتحسين وظائف Vite
    plugins: [
      react(), // Support for React - دعم مكتبة ريأكت
      tailwindcss(), // Support for Tailwind CSS - دعم تيلويند
      // Compress build files using Gzip and Brotli for faster loading
      // ضغط ملفات المشروع لتقليل حجمها وسرعة تحميل الموقع
      viteCompression({ algorithm: "gzip" }),
      viteCompression({ algorithm: "brotliCompress" }),
      // Bundle analyzer (only in production) to visualize chunk sizes
      // أداة لتحليل حجم ملفات المشروع بعد الـ Build (تعمل في وضع الإنتاج فقط)
      mode === "production" &&
        visualizer({
          filename: "./dist/stats.html",
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    // Local Development Server settings
    // إعدادات سيرفر التطوير (npm run dev)
    server: {
      headers: securityHeaders, // Apply security headers - تطبيق إعدادات الأمان
      // Proxy to bypass CORS issues with the Backend API
      // وسيط (Proxy) لربط الموقع بالسيرفر الخلفي وتفادي مشاكل الـ CORS
      proxy: {
        "/api": {
          target: env.VITE_APP_API_URL, // Backend URL - رابط السيرفر
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""), // Remove '/api' prefix - إزالة كلمة api من الرابط
        },
      },
    },

    // Preview Server settings (testing the production build)
    // إعدادات المعاينة (اختبار نسخة الـ Build محلياً)
    preview: {
      headers: {
        ...securityHeaders,
        // Force HSTS (HTTPS) when in production
        // فرض التشفير (HTTPS) في وضع الإنتاج
        ...(mode === "production" && {
          "Strict-Transport-Security":
            "max-age=31536000; includeSubDomains; preload",
        }),
      },
      // Proxy for preview server to fetch data and images
      // وسيط (Proxy) لسيرفر المعاينة لجلب البيانات والصور
      proxy: {
        "/api": {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          headers: {
            "X-Tunnel-Skip-AntiPhishing-Page": "true", // Bypass dev tunnel warning - تخطي صفحة التحذير في روابط dev tunnels
          },
        },
      },
    },

    // Build process optimizations
    // إعدادات تحسين نسخة الإنتاج النهائية
    build: {
      target: "esnext", // Output modern JS - إنتاج كود جافا سكريبت حديث
      minify: "esbuild", // Minify JS/CSS - ضغط الكود
      cssCodeSplit: true, // Split CSS per page - تقسيم ملفات التصميم
      chunkSizeWarningLimit: 600, // Reduced limit for better awareness
      reportCompressedSize: false, // Speed up build
      rollupOptions: {
        output: {
          // Manual chunking to optimize shared libraries and caching
          // تقسيم يدوي للمكتبات لتحسين سرعة التحميل والكاش
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("react") ||
                id.includes("react-dom") ||
                id.includes("react-router")
              ) {
                return "vendor-react";
              }
              if (id.includes("three") || id.includes("@react-three")) {
                return "vendor-three";
              }
              if (id.includes("framer-motion")) {
                return "vendor-motion";
              }
              if (id.includes("recharts")) {
                return "vendor-charts";
              }
              if (id.includes("lucide-react") || id.includes("react-icons")) {
                return "vendor-icons";
              }
              if (
                id.includes("@reduxjs/toolkit") ||
                id.includes("react-redux")
              ) {
                return "vendor-redux";
              }
              return "vendor-others";
            }
          },
        },
      },
    },
    // Vitest configuration
    // إعدادات Vitest للاختبارات
    test: {
      globals: true, // Allow using 'describe', 'it', 'expect' without importing - السماح باستخدام دوال الاختبار بدون استيرادها
      environment: "jsdom", // Use jsdom for React component testing - استخدام بيئة jsdom لاختبار المكونات
      setupFiles: "./src/test/setup.tsx", // Path to global setup file - مسار ملف الإعداد العالمي
      css: true, // Process CSS in tests - معالجة ملفات CSS في الاختبارات
      include: ["src/**/*.{test,spec}.{ts,tsx}"], // Only include tests in src - تشمل فقط الاختبارات الموجودة في src
      exclude: ["**/node_modules/**", "**/dist/**", "**/tests/e2e/**"], // Exclude E2E tests and other folders - استبعاد اختبارات E2E والمجلدات الأخرى
    },
  };
});
