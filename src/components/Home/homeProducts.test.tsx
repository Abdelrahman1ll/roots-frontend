import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomeProducts from "./homeProducts";
import { useGetProductsQuery } from "../../redux/products/apiProducts";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the API hook
vi.mock("../../redux/products/apiProducts", () => ({
  useGetProductsQuery: vi.fn(),
}));

// Mock Cloudinary utils
vi.mock("../../utils/cloudinary", () => ({
  getCloudinaryUrl: vi.fn((url) => url),
  getCloudinarySrcSet: vi.fn(() => ""),
}));

import React from "react";

// Mock Framer Motion
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: new Proxy(
    {},
    {
      get: () => {
        return ({ children, ...props }: any) => {
          return <div {...props}>{children}</div>;
        };
      },
    },
  ),
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  PackageSearch: () => <div data-testid="package-search-icon" />,
}));

describe("HomeProducts Component", () => {
  const mockProducts = {
    products: [
      {
        id: "1",
        name: "Test Product 1",
        price: 100,
        images: ["image1.jpg"],
        discountPercentage: 10,
      },
      {
        id: "2",
        name: "Test Product 2",
        price: 200,
        images: ["image2.jpg"],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <HomeProducts />
      </BrowserRouter>,
    );

    // Should show skeletons (represented by bg-gray-100 animate-pulse in the code)
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state correctly", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <HomeProducts />
      </BrowserRouter>,
    );

    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
    expect(screen.getByTestId("package-search-icon")).toBeInTheDocument();
  });

  it("renders empty state correctly", () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: { products: [] },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <HomeProducts />
      </BrowserRouter>,
    );

    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });

  it("renders products correctly when data is fetched", async () => {
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetProductsQuery>);

    render(
      <BrowserRouter>
        <HomeProducts />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("Trending Now")[0]).toBeInTheDocument();
    expect(await screen.findByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getAllByText(/100/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/200/)[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) => content.includes("10%") && content.includes("OFF"),
      ),
    ).toBeInTheDocument();
  });
});
