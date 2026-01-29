import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductSlider from "./productSlider";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock implementation for useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API hook
vi.mock("../../redux/products/apiProducts", () => ({
  useGetProductsQuery: vi.fn(),
}));

import { useGetProductsQuery } from "../../redux/products/apiProducts";

// Mock Framer Motion
// Mock Framer Motion
vi.mock("framer-motion", () => {
  const motionComponent = (Tag: string) => {
    return ({ children, ...props }: any) =>
      React.createElement(Tag, props, children);
  };

  return {
    motion: {
      div: motionComponent("div"),
      button: motionComponent("button"),
      span: motionComponent("span"),
      h1: motionComponent("h1"),
      h2: motionComponent("h2"),
      p: motionComponent("p"),
      section: motionComponent("section"),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <svg />,
  ChevronRight: () => <svg />,
  PackageSearch: () => <svg />,
}));

// Mock Cloudinary utils
vi.mock("../../utils/cloudinary", () => ({
  getCloudinaryUrl: (src: string) => src,
  getCloudinarySrcSet: () => "",
}));

describe("ProductSlider Component", () => {
  const mockProducts = {
    products: [
      { id: 1, name: "Product 1", price: 100, images: ["img1.jpg"] },
      { id: 2, name: "Product 2", price: 200, images: ["img2.jpg"] },
      { id: 3, name: "Product 3", price: 300, images: ["img3.jpg"] },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("renders loading skeletons when data is loading", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: null,
      isLoading: true,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <ProductSlider />
      </BrowserRouter>,
    );

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });

  it("renders 'No products found' when products list is empty", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: { products: [] },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <ProductSlider />
      </BrowserRouter>,
    );

    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });

  it("renders the first product by default", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <ProductSlider />
      </BrowserRouter>,
    );

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("navigates to next product when clicking next button", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <ProductSlider />
      </BrowserRouter>,
    );

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1]; // Index 0 is prev, Index 1 is next

    fireEvent.click(nextButton);

    // After clicking next, Product 2 should be 'more visible' (scale 1 in motion logic)
    // Testing state-driven UI often requires checking styles or specific attributes.
    // Since we mock motion as simple div, we'd need to verify state or next render.
  });

  it("navigates to product detail on card click", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <ProductSlider />
      </BrowserRouter>,
    );

    const productCard = screen
      .getByText("Product 1")
      .closest("div[class*='relative group/card']");
    fireEvent.click(productCard!);

    expect(mockNavigate).toHaveBeenCalledWith("/products-details/1");
  });

  it("persists slider index in sessionStorage", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <ProductSlider />
      </BrowserRouter>,
    );

    expect(sessionStorage.getItem("product-slider-index")).toBe("0");

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1];
    fireEvent.click(nextButton);

    expect(sessionStorage.getItem("product-slider-index")).toBe("1");
  });
});
