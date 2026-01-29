import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UserMenu from "./UserMenu";
import { AuthContext } from "../../context/AuthContext";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("UserMenu Component", () => {
  const mockHandleLogout = vi.fn();
  const mockUser = {
    id: 1,
    email: "test@example.com",
    role: "user",
    createdAt: "2023-01-01",
    firstName: "Test",
    lastName: "User",
  };

  const renderWithContext = (user: any = mockUser) => {
    return render(
      <AuthContext.Provider
        value={{
          user,
          setUser: vi.fn(),
          logout: vi.fn(),
          initializing: false,
        }}
      >
        <MemoryRouter>
          <UserMenu handleLogout={mockHandleLogout} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the avatar button", () => {
    renderWithContext();
    expect(screen.getByTitle("حسابي")).toBeInTheDocument();
  });

  it("toggles the menu on click", () => {
    renderWithContext();

    // Menu should be hidden initially
    expect(screen.queryByText("Logged in as")).not.toBeInTheDocument();

    const avatar = screen.getByTitle("حسابي");
    fireEvent.click(avatar);

    expect(screen.getByText("Logged in as")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders standard menu items for regular user", () => {
    renderWithContext();
    fireEvent.click(screen.getByTitle("حسابي"));

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(screen.queryByText("Admin Actions")).not.toBeInTheDocument();
  });

  it("renders admin items when user role is owner", () => {
    renderWithContext({ ...mockUser, role: "owner" });
    fireEvent.click(screen.getByTitle("حسابي"));

    expect(screen.getByText("Admin Actions")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("All Users")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
  });

  it("calls handleLogout and closes menu on logout click", () => {
    renderWithContext();
    fireEvent.click(screen.getByTitle("حسابي"));

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    expect(mockHandleLogout).toHaveBeenCalled();
    // Menu should close
    expect(screen.queryByText("Logged in as")).not.toBeInTheDocument();
  });

  it("closes the menu when a link is clicked", () => {
    renderWithContext();
    fireEvent.click(screen.getByTitle("حسابي"));

    const profileLink = screen.getByText("Profile");
    fireEvent.click(profileLink);

    expect(screen.queryByText("Logged in as")).not.toBeInTheDocument();
  });
});
