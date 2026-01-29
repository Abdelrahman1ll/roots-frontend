import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import AllUsers from "./Users";
import { BrowserRouter } from "react-router-dom";
import * as apiUsers from "../../redux/users/apiUsers";
import "@testing-library/jest-dom";

// Mock hooks
vi.mock("../../redux/users/apiUsers", () => ({
  useGetUsersQuery: vi.fn(),
}));

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
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("AllUsers Component", () => {
  const mockUsers = [
    {
      id: 1,
      email: "user1@example.com",
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      id: 2,
      email: "test2@test.com",
      createdAt: "2023-02-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it("renders loading skeleton when loading", () => {
    (apiUsers.useGetUsersQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { container } = renderWithRouter(<AllUsers />);
    expect(
      container.getElementsByClassName("animate-pulse").length,
    ).toBeGreaterThan(0);
  });

  it("renders list of users", () => {
    (apiUsers.useGetUsersQuery as Mock).mockReturnValue({
      data: { users: mockUsers },
      isLoading: false,
    });

    renderWithRouter(<AllUsers />);
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    expect(screen.getByText("test2@test.com")).toBeInTheDocument();
    expect(screen.getByText("Total Boutique Members: 2")).toBeInTheDocument();
  });

  it("filters users by search term", () => {
    (apiUsers.useGetUsersQuery as Mock).mockReturnValue({
      data: { users: mockUsers },
      isLoading: false,
    });

    renderWithRouter(<AllUsers />);

    const searchInput = screen.getByPlaceholderText(
      "Filter by email address...",
    );
    fireEvent.change(searchInput, { target: { value: "user1" } });

    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    expect(screen.queryByText("test2@test.com")).not.toBeInTheDocument();
  });

  it("shows empty state when no users found", () => {
    (apiUsers.useGetUsersQuery as Mock).mockReturnValue({
      data: { users: [] },
      isLoading: false,
    });

    renderWithRouter(<AllUsers />);
    expect(
      screen.getByText("No mirrors matching that style"),
    ).toBeInTheDocument();
  });
});
