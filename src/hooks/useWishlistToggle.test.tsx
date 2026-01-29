import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWishlistToggle } from "./useWishlistToggle";
import { AuthContext } from "../context/AuthContext";
import type { UserType } from "../types/UserType";
import * as apiWishlist from "../redux/wishlist/apiWishlist";
import { toast } from "react-toastify";
import React from "react";

// Mock the dependencies
vi.mock("react-toastify", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../redux/wishlist/apiWishlist", () => ({
  useGetWishlistQuery: vi.fn(),
  usePostWishlistMutation: vi.fn(),
  useDeleteWishlistMutation: vi.fn(),
}));

describe("useWishlistToggle Hook", () => {
  const mockUser: UserType = {
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    role: "user",
    createdAt: new Date().toISOString(),
  };
  const mockWishlistData = {
    wishlist: [{ id: 101, product: { id: 10 } }],
  };

  const mockRefetch = vi.fn();
  const mockPostWishlist = vi
    .fn()
    .mockReturnValue({ unwrap: () => Promise.resolve({}) });
  const mockDeleteWishlist = vi
    .fn()
    .mockReturnValue({ unwrap: () => Promise.resolve({}) });

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(apiWishlist.useGetWishlistQuery).mockReturnValue({
      data: mockWishlistData,
      refetch: mockRefetch,
      isLoading: false,
    });
    vi.mocked(apiWishlist.usePostWishlistMutation).mockReturnValue([
      mockPostWishlist,
      { isLoading: false, reset: vi.fn() },
    ]);
    vi.mocked(apiWishlist.useDeleteWishlistMutation).mockReturnValue([
      mockDeleteWishlist,
      { isLoading: false, reset: vi.fn() },
    ]);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider
      value={{
        user: mockUser,
        setUser: vi.fn(),
        logout: vi.fn(),
        initializing: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  it("should initialize isFav based on wishlist data", () => {
    const { result } = renderHook(() => useWishlistToggle(), { wrapper });

    expect(result.current.isFav[10]).toBe(true);
    expect(result.current.wishlist).toEqual(mockWishlistData.wishlist);
  });

  it("should show info toast if user is not logged in when toggling", async () => {
    const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider
        value={{
          user: null,
          setUser: vi.fn(),
          logout: vi.fn(),
          initializing: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );

    vi.mocked(apiWishlist.useGetWishlistQuery).mockReturnValue({
      data: null,
      refetch: mockRefetch,
      isLoading: false,
    });

    const { result } = renderHook(() => useWishlistToggle(), {
      wrapper: emptyWrapper,
    });

    await act(async () => {
      await result.current.handleToggleWishlist(10);
    });

    expect(toast.info).toHaveBeenCalledWith(
      "Please login to add items to your wishlist",
    );
    expect(mockPostWishlist).not.toHaveBeenCalled();
  });

  it("should add to wishlist if product is not in the list", async () => {
    const { result } = renderHook(() => useWishlistToggle(), { wrapper });

    await act(async () => {
      await result.current.handleToggleWishlist(20); // Product ID 20 is not in mockWishlistData
    });

    expect(mockPostWishlist).toHaveBeenCalledWith({ product: 20 });
    expect(result.current.isFav[20]).toBe(true);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should remove from wishlist if product is already in the list", async () => {
    const { result } = renderHook(() => useWishlistToggle(), { wrapper });

    await act(async () => {
      await result.current.handleToggleWishlist(10); // Product ID 10 is in mockWishlistData
    });

    expect(mockDeleteWishlist).toHaveBeenCalledWith(101); // 101 is the wishlist item ID for product 10
    expect(result.current.isFav[10]).toBe(false);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should initialize isFav as empty if wishlist data is missing", () => {
    vi.mocked(apiWishlist.useGetWishlistQuery).mockReturnValue({
      data: { wishlist: null },
      refetch: mockRefetch,
      isLoading: false,
    });

    const { result } = renderHook(() => useWishlistToggle(), { wrapper });

    expect(result.current.isFav).toEqual({});
  });

  it("should synchronize isFav when wishlist data updates", () => {
    const { result, rerender } = renderHook(() => useWishlistToggle(), {
      wrapper,
    });

    expect(result.current.isFav[10]).toBe(true);

    // Simulate data update
    vi.mocked(apiWishlist.useGetWishlistQuery).mockReturnValue({
      data: { wishlist: [{ id: 102, product: { id: 30 } }] },
      refetch: mockRefetch,
      isLoading: false,
    });

    rerender();

    expect(result.current.isFav[10]).toBeUndefined();
    expect(result.current.isFav[30]).toBe(true);
  });

  it("should show error toast if toggling fails", async () => {
    mockPostWishlist.mockReturnValueOnce({
      unwrap: () => Promise.reject(new Error("Failed")),
    });

    const { result } = renderHook(() => useWishlistToggle(), { wrapper });

    await act(async () => {
      await result.current.handleToggleWishlist(20);
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to toggle favorite");
  });
});
