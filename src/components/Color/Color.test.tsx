import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Color from "./Color";
import {
  useGetColorsQuery,
  usePostColorMutation,
  usePatchColorMutation,
  useDeleteColorMutation,
} from "../../redux/color/apiColor";
import "@testing-library/jest-dom";

// Mock the API hooks
vi.mock("../../redux/color/apiColor", () => ({
  useGetColorsQuery: vi.fn(),
  usePostColorMutation: vi.fn(),
  usePatchColorMutation: vi.fn(),
  useDeleteColorMutation: vi.fn(),
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

describe("Color Component", () => {
  const mockRefetch = vi.fn();
  const mockPostColor = vi.fn();
  const mockPatchColor = vi.fn();
  const mockDeleteColor = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePostColorMutation as any).mockReturnValue([
      mockPostColor,
      { isLoading: false },
    ]);
    (usePatchColorMutation as any).mockReturnValue([
      mockPatchColor,
      { isLoading: false },
    ]);
    (useDeleteColorMutation as any).mockReturnValue([
      mockDeleteColor,
      { isLoading: false },
    ]);
  });

  it("renders loading skeleton when isLoading is true", () => {
    (useGetColorsQuery as any).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });

    render(<Color />);
    expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
  });

  it("renders error state when error is present", () => {
    (useGetColorsQuery as any).mockReturnValue({
      isLoading: false,
      data: null,
      error: { message: "Failed" },
    });

    render(<Color />);
    expect(screen.getByText("Failed to load colors")).toBeInTheDocument();
  });

  it("renders empty state message when no colors exist", () => {
    (useGetColorsQuery as any).mockReturnValue({
      isLoading: false,
      data: { colors: [] },
      error: null,
    });

    render(<Color />);
    expect(
      screen.getByText(/The palette is currently empty/i),
    ).toBeInTheDocument();
  });

  it("renders colors correctly", () => {
    (useGetColorsQuery as any).mockReturnValue({
      isLoading: false,
      data: {
        colors: [
          { id: 1, name: "Midnight Black", color: "#000000" },
          { id: 2, name: "Snow White", color: "#ffffff" },
        ],
      },
      error: null,
    });

    render(<Color />);
    expect(screen.getByText("Midnight Black")).toBeInTheDocument();
    expect(screen.getByText("#000000")).toBeInTheDocument();
    expect(screen.getByText("Snow White")).toBeInTheDocument();
    expect(screen.getByText("#ffffff")).toBeInTheDocument();
  });

  it("handles registering a new color", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockPostColor.mockReturnValue({ unwrap: unwrapMock });

    (useGetColorsQuery as any).mockReturnValue({
      isLoading: false,
      data: { colors: [] },
      error: null,
      refetch: mockRefetch,
    });

    render(<Color />);

    const nameInput = screen.getByPlaceholderText(/Midnight Black/i);
    // There isn't a direct placeholder for the color input, it's a hidden input.
    // The button triggers it. We can find the color input by type.
    const colorInput = document.querySelector(
      'input[type="color"]',
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /Register/i });

    fireEvent.change(nameInput, { target: { value: "Rose Gold" } });
    fireEvent.change(colorInput, { target: { value: "#b76e79" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPostColor).toHaveBeenCalledWith({
        name: "Rose Gold",
        color: "#b76e79",
      });
      expect(unwrapMock).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it("handles editing an existing color", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockPatchColor.mockReturnValue({ unwrap: unwrapMock });

    (useGetColorsQuery as any).mockReturnValue({
      isLoading: false,
      data: {
        colors: [{ id: 1, name: "Old Gold", color: "#ffd700" }],
      },
      error: null,
      refetch: mockRefetch,
    });

    render(<Color />);

    // Click edit button (middle button usually in the action group)
    // buttons: 0: Register, 1: Color Picker Toggle, 2: Edit, 3: Trash
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);

    const nameInput = screen.getByPlaceholderText(/Midnight Black/i);
    expect(nameInput).toHaveValue("Old Gold");

    fireEvent.change(nameInput, { target: { value: "Shiny Gold" } });

    const updateButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockPatchColor).toHaveBeenCalledWith({
        id: 1,
        data: { name: "Shiny Gold", color: "#ffd700" },
      });
      expect(unwrapMock).toHaveBeenCalled();
    });
  });

  it("handles deleting a color", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockDeleteColor.mockReturnValue({ unwrap: unwrapMock });

    (useGetColorsQuery as any).mockReturnValue({
      isLoading: false,
      data: {
        colors: [{ id: 1, name: "Bad Color", color: "#ff0000" }],
      },
      error: null,
      refetch: mockRefetch,
    });

    render(<Color />);

    const buttons = screen.getAllByRole("button");
    // Index 3: Trash
    fireEvent.click(buttons[3]);

    await waitFor(() => {
      expect(mockDeleteColor).toHaveBeenCalledWith(1);
      expect(unwrapMock).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
