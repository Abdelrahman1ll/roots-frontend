import React from "react";
import { describe, it, expect, vi, type Mock } from "vitest";

// Mock CSS to avoid parsing errors
vi.mock("./index.css", () => ({}));

// Mock App component to avoid full app rendering
vi.mock("./App.tsx", () => ({
  default: () => <div data-testid="app-root" />,
}));

// Mock environment variables
vi.stubGlobal("import.meta", {
  env: { VITE_GOOGLE_CLIENT_ID: "mock-client-id" },
});

// Mock dependencies BEFORE importing main.tsx
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

vi.mock("react-redux", () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock DOM element
const mockRoot = document.createElement("div");
mockRoot.id = "root";
document.body.appendChild(mockRoot);

describe("Main Entry Point", () => {
  it("renders the app into the root element", async () => {
    // Import main.tsx triggering the render code
    await import("./main");

    // Check if createRoot was called with the correct element
    const { createRoot } = await import("react-dom/client");
    expect(createRoot).toHaveBeenCalledWith(mockRoot);

    // Check if render was called
    const mockRootInstance = (createRoot as Mock).mock.results[0].value;
    expect(mockRootInstance.render).toHaveBeenCalled();
  });
});
