import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import Wishlist from "./Wishlist";
import UseWishlist from "./useWishlist";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the hook
vi.mock("./useWishlist", () => ({
  default: vi.fn(),
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
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
    img: ({
      src,
      alt,
      ...props
    }: {
      src: string;
      alt: string;
      [key: string]: unknown;
    }) => <img src={src} alt={alt} {...props} />,
  },
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  PackageSearch: () => <svg data-testid="package-search-icon" />,
  Heart: () => <svg data-testid="heart-icon" />,
}));

describe("Wishlist Component", () => {
  const mockHandleToggleWishlist = vi.fn();
  const mockUseWishlistDefaults = {
    handleToggleWishlist: mockHandleToggleWishlist,
    isFav: {},
    isLoading: false,
    user: { role: "user" },
    data: { wishlist: [] },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (UseWishlist as Mock).mockReturnValue(mockUseWishlistDefaults);
  });

  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it("renders loading skeleton when isLoading is true", () => {
    (UseWishlist as Mock).mockReturnValue({
      ...mockUseWishlistDefaults,
      isLoading: true,
    });

    const { container } = renderWithRouter(<Wishlist />);
    // Check for skeleton elements (e.g., animate-pulse class)
    expect(
      container.getElementsByClassName("animate-pulse").length,
    ).toBeGreaterThan(0);
  });

  it("renders empty state when wishlist is empty", () => {
    renderWithRouter(<Wishlist />);
    expect(
      screen.getByText("No products found in wishlist"),
    ).toBeInTheDocument();
  });

  it("renders wishlist items correctly", () => {
    const mockProduct = {
      id: 1,
      name: "Test Shirt",
      price: 100,
      promotionalPrice: 80,
      images: ["img1.jpg", "img2.jpg"],
      stock: 5,
      discountPercentage: 20,
      category: { name: "Shirts" },
    };

    (UseWishlist as Mock).mockReturnValue({
      ...mockUseWishlistDefaults,
      data: { wishlist: [{ product: mockProduct }] },
      isFav: { 1: true },
    });

    renderWithRouter(<Wishlist />);

    expect(screen.getByText("Test Shirt")).toBeInTheDocument();
    expect(screen.getByText("Shirts")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("80 EGP")).toBeInTheDocument();
    expect(screen.getByText("20% OFF")).toBeInTheDocument();
  });

  it("calls handleToggleWishlist when heart icon is clicked", () => {
    const mockProduct = {
      id: 1,
      name: "Test Shirt",
      price: 100,
      promotionalPrice: 100,
      images: ["img1.jpg"],
      stock: 5,
      discountPercentage: 0,
      category: "Shirts",
    };

    (UseWishlist as Mock).mockReturnValue({
      ...mockUseWishlistDefaults,
      data: { wishlist: [{ product: mockProduct }] },
    });

    renderWithRouter(<Wishlist />);

    const removeBtn = screen.getByLabelText("Remove from wishlist");
    fireEvent.click(removeBtn);

    expect(mockHandleToggleWishlist).toHaveBeenCalledWith(1);
  });
});
