import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import ProductDetail from "./ProductDetail";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useProductDetail hook
vi.mock("./useProductDetail", () => ({
  default: vi.fn(),
}));

import useProductDetail from "./useProductDetail";

// Mock components that might be problematic in tests
vi.mock("./ImageZoom", () => ({
  default: ({ mainImage }: { mainImage: string }) => (
    <img data-testid="main-image" src={mainImage} alt="product" />
  ),
}));

vi.mock("./AddToCartButton", () => ({
  default: ({ addToCart }: { addToCart: () => void }) => (
    <button onClick={addToCart}>Add To Cart</button>
  ),
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
    span: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span>ChevronLeft</span>,
  ChevronRight: () => <span>ChevronRight</span>,
  Heart: () => <span>Heart</span>,
  PackageSearch: () => <span>PackageSearch</span>,
}));

describe("ProductDetail Component", () => {
  const mockProduct = {
    id: 1,
    name: "Premium T-Shirt",
    price: 500,
    promotionalPrice: 600,
    discountPercentage: 16.67,
    description: "A high-quality cotton t-shirt.",
    stock: 50,
    total_stock: 100,
    category: { name: "Clothing" },
    images: ["image1.jpg", "image2.jpg"],
    sizes: [
      { id: 1, size: "S", stock: 10, length: 70, width: 45 },
      { id: 2, size: "M", stock: 0, length: 72, width: 48 },
    ],
  };

  const defaultMockValues = {
    product: mockProduct,
    isFav: false,
    handleToggleWishlist: vi.fn(),
    mainImage: "image1.jpg",
    handleNext: vi.fn(),
    handlePrev: vi.fn(),
    quantity: 1,
    increase: vi.fn(),
    decrease: vi.fn(),
    percentstock: 50,
    getColor: () => "var(--color-tiger)",
    errors: { selectedSize: null, quantity: null, id: null },
    addToCart: vi.fn(),
    selectedSize: null,
    setSelectedSize: vi.fn(),
    isLoading: false,
    isFetching: false,
    setCurrentIndex: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when isLoading is true", () => {
    (useProductDetail as unknown as Mock).mockReturnValue({
      ...defaultMockValues,
      product: null,
      isLoading: true,
    } as unknown as ReturnType<typeof useProductDetail>);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders not found state when product is null and not loading", () => {
    (useProductDetail as unknown as Mock).mockReturnValue({
      ...defaultMockValues,
      product: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useProductDetail>);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Sorry, this product is not available/i),
    ).toBeInTheDocument();
    expect(screen.getByText("PackageSearch")).toBeInTheDocument();
  });

  it("renders product information correctly", () => {
    (useProductDetail as unknown as Mock).mockReturnValue(defaultMockValues);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    expect(screen.getByText("Premium T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("EGP 600")).toBeInTheDocument();
    expect(
      screen.getByText("A high-quality cotton t-shirt."),
    ).toBeInTheDocument();
    expect(screen.getByText(/CLOTHING/i)).toBeInTheDocument();
    expect(screen.getByTestId("main-image")).toHaveAttribute(
      "src",
      "image1.jpg",
    );
  });

  it("renders sizes and handles selection", () => {
    const setSelectedSize = vi.fn();
    (useProductDetail as unknown as Mock).mockReturnValue({
      ...defaultMockValues,
      setSelectedSize,
    } as unknown as ReturnType<typeof useProductDetail>);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    const sizeS = screen.getByText("S");
    const sizeM = screen.getByText("M");

    expect(sizeS).toBeInTheDocument();
    expect(sizeM).toBeInTheDocument();

    fireEvent.click(sizeS);
    expect(setSelectedSize).toHaveBeenCalledWith(1);

    // M is out of stock in mock data (stock: 0)
    expect(sizeM).toBeDisabled();
  });

  it("calls increase and decrease quantity functions", () => {
    const increase = vi.fn();
    const decrease = vi.fn();
    (useProductDetail as unknown as Mock).mockReturnValue({
      ...defaultMockValues,
      increase,
      decrease,
    } as unknown as ReturnType<typeof useProductDetail>);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    const plusBtn = screen.getByText("+");
    const minusBtn = screen.getByText("−");

    fireEvent.click(plusBtn);
    expect(increase).toHaveBeenCalled();

    fireEvent.click(minusBtn);
    expect(decrease).toHaveBeenCalled();
  });

  it("calls handleNext and handlePrev functions", () => {
    const handleNext = vi.fn();
    const handlePrev = vi.fn();
    (useProductDetail as unknown as Mock).mockReturnValue({
      ...defaultMockValues,
      handleNext,
      handlePrev,
    } as unknown as ReturnType<typeof useProductDetail>);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    const nextBtn = screen.getByText("ChevronRight").closest("button");
    const prevBtn = screen.getByText("ChevronLeft").closest("button");

    fireEvent.click(nextBtn!);
    expect(handleNext).toHaveBeenCalled();

    fireEvent.click(prevBtn!);
    expect(handlePrev).toHaveBeenCalled();
  });

  it("calls addToCart when button is clicked", () => {
    const addToCart = vi.fn();
    (useProductDetail as unknown as Mock).mockReturnValue({
      ...defaultMockValues,
      addToCart,
    } as unknown as ReturnType<typeof useProductDetail>);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    const addBtn = screen.getByText(/Add To Cart/i);
    fireEvent.click(addBtn);
    expect(addToCart).toHaveBeenCalled();
  });

  it("calls handleToggleWishlist when heart button is clicked", () => {
    const handleToggleWishlist = vi.fn();
    (useProductDetail as unknown as Mock).mockReturnValue({
      ...defaultMockValues,
      handleToggleWishlist,
    } as unknown as ReturnType<typeof useProductDetail>);

    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    const heartBtn = screen.getByText("Heart").closest("button");
    fireEvent.click(heartBtn!);
    expect(handleToggleWishlist).toHaveBeenCalled();
  });
});
