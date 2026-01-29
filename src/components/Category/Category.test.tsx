import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Category from "./Category";
import {
  useGetCategoryQuery,
  usePostCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/category/apiCategory";
import "@testing-library/jest-dom";

// Mock the API hooks
vi.mock("../../redux/category/apiCategory", () => ({
  useGetCategoryQuery: vi.fn(),
  usePostCategoryMutation: vi.fn(),
  usePatchCategoryMutation: vi.fn(),
  useDeleteCategoryMutation: vi.fn(),
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Framer Motion
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

// Mock Skeleton
vi.mock("../Skeleton", () => ({
  SkeletonList: ({ count }: { count: number }) => (
    <div data-testid="skeleton-list">Skeleton {count}</div>
  ),
}));

describe("Category Component", () => {
  const mockRefetch = vi.fn();
  const mockPostCategory = vi.fn();
  const mockPatchCategory = vi.fn();
  const mockDeleteCategory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePostCategoryMutation as any).mockReturnValue([
      mockPostCategory,
      { isLoading: false },
    ]);
    (usePatchCategoryMutation as any).mockReturnValue([
      mockPatchCategory,
      { isLoading: false },
    ]);
    (useDeleteCategoryMutation as any).mockReturnValue([
      mockDeleteCategory,
      { isLoading: false },
    ]);
  });

  it("renders loading skeleton when isLoading is true", () => {
    (useGetCategoryQuery as any).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    render(<Category />);
    expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
  });

  it("renders error state when error is present", () => {
    (useGetCategoryQuery as any).mockReturnValue({
      isLoading: false,
      data: null,
      error: { message: "Failed" },
    });

    render(<Category />);
    expect(screen.getByText("Failed to load categories")).toBeInTheDocument();
  });

  it("renders empty state message when no categories exist", () => {
    (useGetCategoryQuery as any).mockReturnValue({
      isLoading: false,
      data: { categories: [] },
      error: null,
    });

    render(<Category />);
    expect(
      screen.getByText(/Classification vault is empty/i),
    ).toBeInTheDocument();
  });

  it("renders categories correctly", () => {
    (useGetCategoryQuery as any).mockReturnValue({
      isLoading: false,
      data: {
        categories: [
          { id: 1, name: "Luxury" },
          { id: 2, name: "Modern" },
        ],
      },
      error: null,
    });

    render(<Category />);
    expect(screen.getByText("Luxury")).toBeInTheDocument();
    expect(screen.getByText("Modern")).toBeInTheDocument();
  });

  it("handles creating a new category", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockPostCategory.mockReturnValue({ unwrap: unwrapMock });

    (useGetCategoryQuery as any).mockReturnValue({
      isLoading: false,
      data: { categories: [] },
      error: null,
      refetch: mockRefetch,
    });

    render(<Category />);

    const input = screen.getByPlaceholderText(/Luxury Collection/i);
    const button = screen.getByRole("button", { name: /Create/i });

    fireEvent.change(input, { target: { value: "New Design" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPostCategory).toHaveBeenCalledWith({ name: "New Design" });
      expect(unwrapMock).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it("handles editing an existing category", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockPatchCategory.mockReturnValue({ unwrap: unwrapMock });

    (useGetCategoryQuery as any).mockReturnValue({
      isLoading: false,
      data: {
        categories: [{ id: 1, name: "Old Class" }],
      },
      error: null,
      refetch: mockRefetch,
    });

    render(<Category />);

    // Click edit button
    const editButtons = screen.getAllByRole("button");
    // Find the one with Edit icon or by position, in our mock it's the first button in the actions group
    // Each row has Edit and Trash. Plus there is the Create button in the form.
    // Index 0: Create button. Index 1: Edit cat 1. Index 2: Trash cat 1.
    fireEvent.click(editButtons[1]);

    const input = screen.getByPlaceholderText(/Luxury Collection/i);
    expect(input).toHaveValue("Old Class");

    fireEvent.change(input, { target: { value: "Updated Class" } });

    const updateButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockPatchCategory).toHaveBeenCalledWith({
        id: 1,
        data: { name: "Updated Class" },
      });
      expect(unwrapMock).toHaveBeenCalled();
    });
  });

  it("handles deleting a category", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockDeleteCategory.mockReturnValue({ unwrap: unwrapMock });

    (useGetCategoryQuery as any).mockReturnValue({
      isLoading: false,
      data: {
        categories: [{ id: 1, name: "Bad Category" }],
      },
      error: null,
      refetch: mockRefetch,
    });

    render(<Category />);

    const buttons = screen.getAllByRole("button");
    // Index 0: Create. Index 1: Edit. Index 2: Trash.
    fireEvent.click(buttons[2]);

    await waitFor(() => {
      expect(mockDeleteCategory).toHaveBeenCalledWith(1);
      expect(unwrapMock).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
