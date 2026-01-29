import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UseCart from "./useCart";
import {
  useGetCartQuery,
  usePatchCartMutation,
  useDeleteCartMutation,
} from "../../redux/Cart/apiCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Mock dependencies
vi.mock("../../redux/Cart/apiCart", () => ({
  useGetCartQuery: vi.fn(),
  usePatchCartMutation: vi.fn(),
  useDeleteCartMutation: vi.fn(),
}));
vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

describe("UseCart Hook", () => {
  const mockNavigate = vi.fn();
  const mockRefetch = vi.fn();
  const mockPatchCart = vi.fn();
  const mockDeleteCart = vi.fn();

  const mockCartData = {
    carts: {
      items: [
        { id: 1, quantity: 2, product: { name: "Product 1", price: 100 } },
        { id: 2, quantity: 5, product: { name: "Product 2", price: 200 } },
      ],
      total: 1200,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useGetCartQuery).mockReturnValue({
      data: mockCartData,
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
      isSuccess: true,
      isFetching: false,
      isUninitialized: false,
      error: undefined,
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: undefined,
      endpointName: "getCart",
      originalArgs: undefined,
      requestId: "test-request-id",
      status: "fulfilled" as const,
    } as any);
    vi.mocked(usePatchCartMutation).mockReturnValue([
      mockPatchCart,
      { isLoading: false } as any,
    ]);
    vi.mocked(useDeleteCartMutation).mockReturnValue([
      mockDeleteCart,
      { isLoading: false } as any,
    ]);
  });

  describe("Initialization", () => {
    it("should initialize with cart data", () => {
      const { result } = renderHook(() => UseCart());

      expect(result.current.data).toEqual(mockCartData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should return navigate function", () => {
      const { result } = renderHook(() => UseCart());

      expect(result.current.navigate).toBe(mockNavigate);
    });
  });

  describe("decreaseQuantity", () => {
    it("should decrease quantity when quantity is greater than 1", async () => {
      mockPatchCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.decreaseQuantity({ id: 1, quantity: 3 });
      });

      expect(mockPatchCart).toHaveBeenCalledWith({
        id: "1",
        data: { quantity: 2 },
      });
      expect(mockRefetch).toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should show info toast when quantity is 1", async () => {
      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.decreaseQuantity({ id: 1, quantity: 1 });
      });

      expect(toast.info).toHaveBeenCalledWith("Minimum quantity reached");
      expect(mockPatchCart).not.toHaveBeenCalled();
    });

    it("should show info toast when quantity is less than 1", async () => {
      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.decreaseQuantity({ id: 1, quantity: 0 });
      });

      expect(toast.info).toHaveBeenCalledWith("Minimum quantity reached");
      expect(mockPatchCart).not.toHaveBeenCalled();
    });

    it("should handle error when decreasing quantity fails", async () => {
      mockPatchCart.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.decreaseQuantity({ id: 1, quantity: 5 });
      });

      expect(toast.error).toHaveBeenCalledWith("Error decreasing quantity");
      expect(mockRefetch).not.toHaveBeenCalled();
    });

    it("should convert id to string when calling patchCart", async () => {
      mockPatchCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.decreaseQuantity({ id: 123, quantity: 5 });
      });

      expect(mockPatchCart).toHaveBeenCalledWith({
        id: "123",
        data: { quantity: 4 },
      });
    });
  });

  describe("increaseQuantity", () => {
    it("should increase quantity when quantity is less than 15", async () => {
      mockPatchCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.increaseQuantity({ id: 1, quantity: 5 });
      });

      expect(mockPatchCart).toHaveBeenCalledWith({
        id: "1",
        data: { quantity: 6 },
      });
      expect(mockRefetch).toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should show info toast when quantity is 15", async () => {
      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.increaseQuantity({ id: 1, quantity: 15 });
      });

      expect(toast.info).toHaveBeenCalledWith("Maximum quantity reached");
      expect(mockPatchCart).not.toHaveBeenCalled();
    });

    it("should show info toast when quantity is greater than 15", async () => {
      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.increaseQuantity({ id: 1, quantity: 20 });
      });

      expect(toast.info).toHaveBeenCalledWith("Maximum quantity reached");
      expect(mockPatchCart).not.toHaveBeenCalled();
    });

    it("should handle error when increasing quantity fails", async () => {
      mockPatchCart.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.increaseQuantity({ id: 1, quantity: 5 });
      });

      expect(toast.error).toHaveBeenCalledWith("Error increasing quantity");
      expect(mockRefetch).not.toHaveBeenCalled();
    });

    it("should convert id to string when calling patchCart", async () => {
      mockPatchCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.increaseQuantity({ id: 456, quantity: 3 });
      });

      expect(mockPatchCart).toHaveBeenCalledWith({
        id: "456",
        data: { quantity: 4 },
      });
    });

    it("should allow increasing from 14 to 15", async () => {
      mockPatchCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.increaseQuantity({ id: 1, quantity: 14 });
      });

      expect(mockPatchCart).toHaveBeenCalledWith({
        id: "1",
        data: { quantity: 15 },
      });
      expect(toast.info).not.toHaveBeenCalled();
    });
  });

  describe("removeItem", () => {
    it("should remove item successfully", async () => {
      mockDeleteCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.removeItem(1);
      });

      expect(mockDeleteCart).toHaveBeenCalledWith("1");
      expect(mockRefetch).toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should handle error when removing item fails", async () => {
      mockDeleteCart.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.removeItem(1);
      });

      expect(toast.error).toHaveBeenCalledWith("Error removing item");
      expect(mockRefetch).not.toHaveBeenCalled();
    });

    it("should convert id to string when calling deleteCart", async () => {
      mockDeleteCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.removeItem(789);
      });

      expect(mockDeleteCart).toHaveBeenCalledWith("789");
    });
  });

  describe("Loading and Error States", () => {
    it("should handle loading state", () => {
      vi.mocked(useGetCartQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: mockRefetch,
        isSuccess: false,
        isFetching: true,
        isUninitialized: false,
        error: undefined,
        startedTimeStamp: Date.now(),
        fulfilledTimeStamp: undefined,
        currentData: undefined,
        endpointName: "getCart",
        originalArgs: undefined,
        requestId: "test-request-id",
        status: "pending" as const,
      } as any);

      const { result } = renderHook(() => UseCart());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("should handle error state", () => {
      vi.mocked(useGetCartQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: mockRefetch,
        isSuccess: false,
        isFetching: false,
        isUninitialized: false,
        error: { status: 500, data: "Server error" },
        startedTimeStamp: Date.now(),
        fulfilledTimeStamp: undefined,
        currentData: undefined,
        endpointName: "getCart",
        originalArgs: undefined,
        requestId: "test-request-id",
        status: "rejected" as const,
      } as any);

      const { result } = renderHook(() => UseCart());

      expect(result.current.isError).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty cart data", () => {
      vi.mocked(useGetCartQuery).mockReturnValue({
        data: { carts: { items: [], total: 0 } },
        isLoading: false,
        isError: false,
        refetch: mockRefetch,
        isSuccess: true,
        isFetching: false,
        isUninitialized: false,
        error: undefined,
        startedTimeStamp: Date.now(),
        fulfilledTimeStamp: Date.now(),
        currentData: undefined,
        endpointName: "getCart",
        originalArgs: undefined,
        requestId: "test-request-id",
        status: "fulfilled" as const,
      } as any);

      const { result } = renderHook(() => UseCart());

      expect(result.current.data?.carts.items).toHaveLength(0);
      expect(result.current.data?.carts.total).toBe(0);
    });

    it("should handle multiple rapid quantity changes", async () => {
      mockPatchCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await Promise.all([
          result.current.increaseQuantity({ id: 1, quantity: 5 }),
          result.current.increaseQuantity({ id: 1, quantity: 6 }),
          result.current.increaseQuantity({ id: 1, quantity: 7 }),
        ]);
      });

      expect(mockPatchCart).toHaveBeenCalledTimes(3);
      expect(mockRefetch).toHaveBeenCalledTimes(3);
    });

    it("should handle refetch being called after successful operations", async () => {
      mockPatchCart.mockResolvedValue({});
      mockDeleteCart.mockResolvedValue({});

      const { result } = renderHook(() => UseCart());

      await act(async () => {
        await result.current.increaseQuantity({ id: 1, quantity: 5 });
      });

      expect(mockRefetch).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.decreaseQuantity({ id: 1, quantity: 5 });
      });

      expect(mockRefetch).toHaveBeenCalledTimes(2);

      await act(async () => {
        await result.current.removeItem(1);
      });

      expect(mockRefetch).toHaveBeenCalledTimes(3);
    });
  });
});
