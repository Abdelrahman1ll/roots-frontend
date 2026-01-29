import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Product from "./product";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the custom hook
vi.mock("./useProduct", () => ({
  default: vi.fn(),
}));

import useProduct from "./useProduct";

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
    img: ({
      _children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <img {...props} />,
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
  },
}));

describe("Product Component", () => {
  const mockProducts = {
    products: [
      {
        id: 1,
        name: "Test Product 1",
        price: 100,
        promotionalPrice: 120,
        discountPercentage: 20,
        stock: 10,
        category: { name: "Test Category" },
        images: ["image1.jpg", "image2.jpg"],
      },
      {
        id: 2,
        name: "Test Product 2",
        price: 200,
        promotionalPrice: 200,
        discountPercentage: 0,
        stock: 0,
        category: "Other Category",
        images: ["image3.jpg"],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when isLoading is true", () => {
    vi.mocked(useProduct).mockReturnValue({
      products: null,
      isLoading: true,
      isFetching: false,
      isFav: {},
      hoveredIds: {},
      user: null,
      isError: false,
      handleToggleWishlist: vi.fn(),
      setHoveredIds: vi.fn(),
    } as unknown as ReturnType<typeof useProduct>);

    render(
      <BrowserRouter>
        <Product />
      </BrowserRouter>,
    );

    // Skeleton items have animate-pulse class
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders empty state when no products are found", () => {
    vi.mocked(useProduct).mockReturnValue({
      products: { products: [] },
      isLoading: false,
      isFetching: false,
      isFav: {},
      hoveredIds: {},
      user: null,
      isError: false,
      handleToggleWishlist: vi.fn(),
      setHoveredIds: vi.fn(),
    } as unknown as ReturnType<typeof useProduct>);

    render(
      <BrowserRouter>
        <Product />
      </BrowserRouter>,
    );

    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });

  it("renders product list correctly", () => {
    vi.mocked(useProduct).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isFetching: false,
      isFav: { 1: true, 2: false },
      hoveredIds: {},
      user: null,
      isError: false,
      handleToggleWishlist: vi.fn(),
      setHoveredIds: vi.fn(),
    } as unknown as ReturnType<typeof useProduct>);

    render(
      <BrowserRouter>
        <Product />
      </BrowserRouter>,
    );

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument(); // Price of product 1
    expect(screen.getByText("200")).toBeInTheDocument(); // Price of product 2
    expect(screen.getByText(/20% OFF/i)).toBeInTheDocument();
    expect(screen.getByText(/Sold Out/i)).toBeInTheDocument(); // Product 2 is out of stock
  });

  it("calls handleToggleWishlist when wishlist button is clicked", () => {
    const handleToggleWishlistMock = vi.fn();
    vi.mocked(useProduct).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isFetching: false,
      isFav: { 1: false },
      hoveredIds: {},
      user: null,
      isError: false,
      handleToggleWishlist: handleToggleWishlistMock,
      setHoveredIds: vi.fn(),
    } as unknown as ReturnType<typeof useProduct>);

    render(
      <BrowserRouter>
        <Product />
      </BrowserRouter>,
    );

    const wishlistBtns = screen.getAllByLabelText(
      /Add to wishlist|Remove from wishlist/i,
    );
    // The first button in the first card is the wishlist button
    fireEvent.click(wishlistBtns[0]);

    expect(handleToggleWishlistMock).toHaveBeenCalledWith(1);
  });
});
