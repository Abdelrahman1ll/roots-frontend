import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext, type AuthContextType } from "../context/AuthContext";
import type { UserType } from "../types/UserType";

// Mock Navigate to track redirects
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate" data-to={to} />),
  };
});

describe("ProtectedRoute Component", () => {
  const mockContext = (
    user: UserType | null,
    initializing: boolean,
  ): AuthContextType => ({
    user,
    initializing,
    setUser: vi.fn(),
    logout: vi.fn(),
  });

  const renderWithContext = (
    contextValue: AuthContextType,
    roles: ("user" | "admin" | "owner")[],
  ) => {
    return render(
      <AuthContext.Provider value={contextValue}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute roles={roles}>
                  <div data-testid="protected-content">Secret content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<div data-testid="home">Home</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
  };

  it("renders null when initializing", () => {
    const { container } = renderWithContext(mockContext(null, true), ["user"]);
    expect(container.firstChild).toBeNull();
  });

  it("redirects to home when no user is authenticated", () => {
    renderWithContext(mockContext(null, false), ["user"]);
    const navigate = screen.getByTestId("navigate");
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute("data-to")).toBe("/");
  });

  it("redirects to home when user role is not allowed", () => {
    const user: UserType = {
      id: 1,
      role: "user",
      email: "test@example.com",
      createdAt: new Date().toISOString(),
    };
    renderWithContext(mockContext(user, false), ["admin", "owner"]);
    const navigate = screen.getByTestId("navigate");
    expect(navigate).toBeInTheDocument();
    expect(navigate.getAttribute("data-to")).toBe("/");
  });

  it("renders children when user is authenticated and has allowed role", () => {
    const user: UserType = {
      id: 1,
      role: "admin",
      email: "test@example.com",
      createdAt: new Date().toISOString(),
    };
    renderWithContext(mockContext(user, false), ["admin", "owner"]);
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });
});
