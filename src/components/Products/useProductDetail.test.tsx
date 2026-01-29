import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useProductDetail from "./useProductDetail";
import * as apiProducts from "../../redux/products/apiProducts";
import * as apiCart from "../../redux/Cart/apiCart";
import { AuthContext } from "../../context/AuthContext";
import { SignupContext } from "../../context/SignupContext";
import { useWishlistToggle } from "../../hooks/useWishlistToggle";
import { useParams } from "react-router-dom";

vi.mock("../../redux/products/apiProducts");
vi.mock("../../redux/Cart/apiCart");
vi.mock("../../hooks/useWishlistToggle");
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("useProductDetail Hook", () => {
  const mockOpenSignup = vi.fn();
  const mockToggleWishlist = vi.fn();
  const mockPostCart = vi.fn();
  const mockUnwrap = vi.fn();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={{ user: { id: 1, role: "user" } } as any}>
      <SignupContext.Provider value={{ openSignup: mockOpenSignup } as any}>
        {children}
      </SignupContext.Provider>
    </AuthContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockPostCart.mockReturnValue({ unwrap: mockUnwrap });
    
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useWishlistToggle).mockReturnValue({
      isFav: { 1: false },
      handleToggleWishlist: mockToggleWishlist,
    } as any);

    vi.mocked(apiProducts.useGetProductIdQuery).mockReturnValue({
      data: { product: { id: 1, name: "Product 1", images: ["img1.jpg", "img2.jpg"], stock: 50, total_stock: 100 } },
      isLoading: false,
      isFetching: false,
    } as any);

    vi.mocked(apiCart.usePostCartMutation).mockReturnValue([mockPostCart] as any);
    vi.mocked(apiCart.useGetCartQuery).mockReturnValue({ refetch: vi.fn() } as any);
  });

  it("handles quantity increase and decrease within bounds", () => {
    const { result } = renderHook(() => useProductDetail(), { wrapper });
    
    expect(result.current.quantity).toBe(1);

    act(() => { result.current.increase(); });
    expect(result.current.quantity).toBe(2);

    for (let i = 0; i < 15; i++) {
      act(() => { result.current.increase(); });
    }
    expect(result.current.quantity).toBe(10); // Max bound

    act(() => { result.current.decrease(); });
    expect(result.current.quantity).toBe(9);

    for (let i = 0; i < 15; i++) {
      act(() => { result.current.decrease(); });
    }
    expect(result.current.quantity).toBe(1); // Min bound
  });

  it("manages image navigation", () => {
    const { result } = renderHook(() => useProductDetail(), { wrapper });
    
    expect(result.current.mainImage).toBe("img1.jpg");

    act(() => { result.current.handleNext(); });
    expect(result.current.mainImage).toBe("img2.jpg");

    act(() => { result.current.handleNext(); });
    expect(result.current.mainImage).toBe("img1.jpg"); // Circular

    act(() => { result.current.handlePrev(); });
    expect(result.current.mainImage).toBe("img2.jpg"); // Circular
  });

  it("calculates stock percentage and color correctly", () => {
    const { result } = renderHook(() => useProductDetail(), { wrapper });
    expect(result.current.percentstock).toBe(50);
    expect(result.current.getColor()).toBe("var(--color-dark)");
  });

  it("validates size and calls addToCart successfully", async () => {
    const { result } = renderHook(() => useProductDetail(), { wrapper });
    
    // Attempt without size
    await act(async () => {
      await result.current.addToCart();
    });
    expect(result.current.errors.selectedSize).toBe("Please select a size");

    // Select size and attempt
    act(() => { result.current.setSelectedSize(1); });
    mockUnwrap.mockResolvedValue({});
    
    await act(async () => {
      await result.current.addToCart();
    });

    expect(mockPostCart).toHaveBeenCalledWith({
      product: 1,
      quantity: 1,
      sizes: 1,
    });
  });

  it("redirects to signup if user is not logged in", async () => {
    const noUserWrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={{ user: null } as any}>
        <SignupContext.Provider value={{ openSignup: mockOpenSignup } as any}>
          {children}
        </SignupContext.Provider>
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useProductDetail(), { wrapper: noUserWrapper });
    
    await act(async () => {
      await result.current.addToCart();
    });

    expect(mockOpenSignup).toHaveBeenCalled();
    expect(mockPostCart).not.toHaveBeenCalled();
  });
});
