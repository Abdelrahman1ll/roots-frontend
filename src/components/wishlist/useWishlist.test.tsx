import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UseWishlist from "./useWishlist";
import { AuthContext } from "../../context/AuthContext";
import { useWishlistToggle } from "../../hooks/useWishlistToggle";
import React from "react";

vi.mock("../../hooks/useWishlistToggle");

describe("useWishlist Hook", () => {
  const mockUser = { id: 1, firstName: "John" };
  const mockWishlistToggle = {
    isFav: vi.fn(),
    handleToggleWishlist: vi.fn(),
    isLoading: false,
    wishlist: [{ id: 101, title: "Product 1" }],
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={{ user: mockUser as any, setUser: vi.fn(), logout: vi.fn(), initializing: false }}>
      {children}
    </AuthContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useWishlistToggle).mockReturnValue(mockWishlistToggle as any);
  });

  it("initializes with data from AuthContext and useWishlistToggle", () => {
    const { result } = renderHook(() => UseWishlist(), { wrapper });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.data.wishlist).toEqual(mockWishlistToggle.wishlist);
  });

  it("handles image slider: nextImage", () => {
    const { result } = renderHook(() => UseWishlist(), { wrapper });
    
    act(() => {
      result.current.nextImage(101, 3);
    });

    expect(result.current.currentImage[101]).toBe(1);

    act(() => {
      result.current.nextImage(101, 3);
    });
    expect(result.current.currentImage[101]).toBe(2);

    act(() => {
      result.current.nextImage(101, 3);
    });
    expect(result.current.currentImage[101]).toBe(0); // Loops back
  });

  it("handles image slider: prevImage", () => {
    const { result } = renderHook(() => UseWishlist(), { wrapper });
    
    act(() => {
      result.current.prevImage(101, 3);
    });
    expect(result.current.currentImage[101]).toBe(2); // Goes to last

    act(() => {
      result.current.prevImage(101, 3);
    });
    expect(result.current.currentImage[101]).toBe(1);
  });

  it("exposes functions from useWishlistToggle", () => {
    const { result } = renderHook(() => UseWishlist(), { wrapper });
    
    act(() => {
      result.current.handleToggleWishlist(101);
    });

    expect(mockWishlistToggle.handleToggleWishlist).toHaveBeenCalledWith(101);
  });
});
