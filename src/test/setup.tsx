import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Automatically cleanup after each test to avoid memory leaks or state contamination
afterEach(() => {
  cleanup();
});

// Mock window.scrollTo
// محاكاة window.scrollTo لتجنب أخطاء "Not implemented" في jsdom
window.scrollTo = vi.fn();

// Global Mock for Framer Motion
// محاكاة عالمية لـ Framer Motion لتجنب تحذيرات props غير المعروفة على عناصر DOM
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({
        children,
        whileHover,
        whileTap,
        whileInView,
        initial,
        animate,
        transition,
        exit,
        ...props
      }: any) => <div {...props}>{children}</div>,
      button: ({
        children,
        whileHover,
        whileTap,
        whileInView,
        initial,
        animate,
        transition,
        exit,
        ...props
      }: any) => <button {...props}>{children}</button>,
      h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
      h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
      h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});
