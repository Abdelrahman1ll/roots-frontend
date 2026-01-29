import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useProduct from "./useProduct";
import * as apiProducts from "../../redux/products/apiProducts";
import { AuthContext } from "../../context/AuthContext";
import { useWishlistToggle } from "../../hooks/useWishlistToggle";
import { useSearchParams } from "react-router-dom";
import React from "react";

vi.mock("../../redux/products/apiProducts");
vi.mock("../../hooks/useWishlistToggle");
vi.mock("react-router-dom", () => ({
  useSearchParams: vi.fn(),
}));

describe("useProduct Hook", () => {
  const mockToggleWishlist = vi.fn();
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={{ user: { id: 1, role: "user" } } as any}>
      {children}
    </AuthContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams()] as any);
    vi.mocked(useWishlistToggle).mockReturnValue({
      isFav: { 1: false },
      handleToggleWishlist: mockToggleWishlist,
    } as any);

    vi.mocked(apiProducts.useGetProductsQuery).mockReturnValue({
      data: { products: [{ id: 1, name: "Product 1" }] },
      isLoading: false,
      isError: false,
      isFetching: false,
    } as any);
  });

  it("returns products without search params", () => {
    const { result } = renderHook(() => useProduct(), { wrapper });
    
    expect(result.current.products.products).toHaveLength(1);
    expect(apiProducts.useGetProductsQuery).toHaveBeenCalledWith("/products");
  });

  it("constructs correct query string from search params", () => {
    const params = new URLSearchParams();
    params.append("name", "shirt");
    params.append("category", "clothing");
    params.append("minPrice", "100");
    vi.mocked(useSearchParams).mockReturnValue([params] as any);

    renderHook(() => useProduct(), { wrapper });
    
    expect(apiProducts.useGetProductsQuery).toHaveBeenCalledWith(
      "/products?name=shirt&category=clothing&minPrice=100"
    );
  });

  it("handles sorting and filtering params", () => {
    const params = new URLSearchParams();
    params.append("sortPrice", "asc");
    params.append("bestSelling", "true");
    vi.mocked(useSearchParams).mockReturnValue([params] as any);

    renderHook(() => useProduct(), { wrapper });
    
    expect(apiProducts.useGetProductsQuery).toHaveBeenCalledWith(
      "/products?sortPrice=asc&bestSelling=true"
    );
  });

  it("returns loading state correctly", () => {
    vi.mocked(apiProducts.useGetProductsQuery).mockReturnValue({
      isLoading: true,
      isFetching: false,
    } as any);

    const { result } = renderHook(() => useProduct(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it("exposes wishlist and user context", () => {
    const { result } = renderHook(() => useProduct(), { wrapper });
    expect(result.current.user).toBeDefined();
    expect(result.current.handleToggleWishlist).toBeDefined();
  });
});
