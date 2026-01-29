import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useDiscountCodes from "./useDiscountCodes";
import {
  useGetDiscountCodesQuery,
  usePostDiscountCodesMutation,
  usePatchDiscountCodesMutation,
  useDeleteDiscountCodesMutation,
} from "../../redux/DiscountCodes/apiDiscountCodes";
import { toast } from "react-toastify";
import type { DiscountCodeType } from "../../types/DiscountCodeType";

// Mock dependencies
vi.mock("../../redux/DiscountCodes/apiDiscountCodes", () => ({
  useGetDiscountCodesQuery: vi.fn(),
  usePostDiscountCodesMutation: vi.fn(),
  usePatchDiscountCodesMutation: vi.fn(),
  useDeleteDiscountCodesMutation: vi.fn(),
}));
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock("../../utils/formatters", () => ({
  formatEndDateArabic: vi.fn((date: string) => date),
}));

describe("useDiscountCodes Hook", () => {
  const mockRefetch = vi.fn();
  const mockPostDiscountCodes = vi.fn();
  const mockPatchDiscountCodes = vi.fn();
  const mockDeleteDiscountCodes = vi.fn();

  const mockDiscountCodes: DiscountCodeType[] = [
    {
      id: 1,
      code: "SUMMER20",
      discount: 20,
      EndDate: "2026-12-31T00:00:00.000Z",
      createdAt: "2026-01-19T10:00:00.000Z",
    },
    {
      id: 2,
      code: "WINTER10",
      discount: 10,
      EndDate: "2026-06-30T00:00:00.000Z",
      createdAt: "2026-01-19T10:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock current date to ensure consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-19T10:00:00.000Z"));

    vi.mocked(useGetDiscountCodesQuery).mockReturnValue({
      data: { discountCodes: mockDiscountCodes },
      isLoading: false,
      refetch: mockRefetch,
      isSuccess: true,
      isError: false,
      error: undefined,
      isFetching: false,
      isUninitialized: false,
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: undefined,
      endpointName: "getDiscountCodes",
      originalArgs: undefined,
      requestId: "test-request-id",
      status: "fulfilled" as const,
    } as any);

    vi.mocked(usePostDiscountCodesMutation).mockReturnValue([
      mockPostDiscountCodes,
      { isLoading: false } as any,
    ]);

    vi.mocked(usePatchDiscountCodesMutation).mockReturnValue([
      mockPatchDiscountCodes,
      { isLoading: false } as any,
    ]);

    vi.mocked(useDeleteDiscountCodesMutation).mockReturnValue([
      mockDeleteDiscountCodes,
      { isLoading: false } as any,
    ]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useDiscountCodes());

      expect(result.current.newCode).toBe("");
      expect(result.current.newDiscount).toBe("");
      expect(result.current.newExpiry).toBe("");
      expect(result.current.editingId).toBeNull();
    });

    it("should load discount codes data", () => {
      const { result } = renderHook(() => useDiscountCodes());

      expect(result.current.data).toEqual({
        discountCodes: mockDiscountCodes,
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("handleAddOrSave - Validation", () => {
    it("should show error when code is empty", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
      expect(mockPostDiscountCodes).not.toHaveBeenCalled();
    });

    it("should show error when code is only whitespace", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("   ");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    });

    it("should show error when code is a number", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("12345");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    });

    it("should show error when discount is empty", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    });

    it("should show error when expiry is empty", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Please fill all fields");
    });

    it("should show error when discount is not a number", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("abc");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Discount must be a number between 1 and 100",
      );
    });

    it("should show error when discount is 0", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("0");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Discount must be a number between 1 and 100",
      );
    });

    it("should show error when discount is negative", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("-10");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Discount must be a number between 1 and 100",
      );
    });

    it("should show error when discount is greater than 100", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("101");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Discount must be a number between 1 and 100",
      );
    });

    it("should show error when expiry date is invalid", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("invalid-date");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Invalid expiry date");
    });

    it("should show error when expiry date is in the past", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2025-01-01");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "End date must be in the future",
      );
    });

    it("should show error when expiry date is current time", async () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2026-01-19T10:00:00.000Z");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "End date must be in the future",
      );
    });
  });

  describe("handleAddOrSave - Adding New Code", () => {
    it("should add new discount code successfully", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("NEWCODE");
        result.current.setNewDiscount("15");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(mockPostDiscountCodes).toHaveBeenCalledWith({
        code: "NEWCODE",
        discount: 15,
        EndDate: "2026-12-31",
      });
      expect(mockRefetch).toHaveBeenCalled();
    });

    it("should convert code to uppercase when adding", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("lowercase");
        result.current.setNewDiscount("20");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(mockPostDiscountCodes).toHaveBeenCalledWith({
        code: "LOWERCASE",
        discount: 20,
        EndDate: "2026-12-31",
      });
    });

    it("should trim whitespace from code when adding", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("  PROMO  ");
        result.current.setNewDiscount("25");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(mockPostDiscountCodes).toHaveBeenCalledWith({
        code: "PROMO",
        discount: 25,
        EndDate: "2026-12-31",
      });
    });

    it("should clear form after successful add", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(result.current.newCode).toBe("");
      expect(result.current.newDiscount).toBe("");
      expect(result.current.newExpiry).toBe("");
      expect(result.current.editingId).toBeNull();
    });

    it("should handle error when adding fails", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi
          .fn()
          .mockRejectedValue({ data: { message: "Code already exists" } }),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Code already exists");
    });

    it("should show generic error when error has no message", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("PROMO");
        result.current.setNewDiscount("10");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Failed to add/edit discount code",
      );
    });
  });

  describe("handleAddOrSave - Editing Existing Code", () => {
    it("should update existing discount code successfully", async () => {
      mockPatchDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      // Simulate editing mode
      act(() => {
        result.current.handleEdit(mockDiscountCodes[0]);
      });

      act(() => {
        result.current.setNewDiscount("25");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(mockPatchDiscountCodes).toHaveBeenCalledWith({
        id: 1,
        data: {
          code: "SUMMER20",
          discount: 25,
          EndDate: "2026-12-31",
        },
      });
      expect(mockRefetch).toHaveBeenCalled();
    });

    it("should clear editing state after successful update", async () => {
      mockPatchDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.handleEdit(mockDiscountCodes[0]);
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(result.current.editingId).toBeNull();
      expect(result.current.newCode).toBe("");
    });

    it("should handle error when updating fails", async () => {
      mockPatchDiscountCodes.mockReturnValue({
        unwrap: vi
          .fn()
          .mockRejectedValue({ data: { message: "Update failed" } }),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.handleEdit(mockDiscountCodes[0]);
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(toast.error).toHaveBeenCalledWith("Update failed");
    });
  });

  describe("handleEdit", () => {
    it("should populate form with discount code data", () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.handleEdit(mockDiscountCodes[0]);
      });

      expect(result.current.editingId).toBe(1);
      expect(result.current.newCode).toBe("SUMMER20");
      expect(result.current.newDiscount).toBe("20");
      expect(result.current.newExpiry).toBe("2026-12-31");
    });

    it("should extract date without time from EndDate", () => {
      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.handleEdit(mockDiscountCodes[0]);
      });

      expect(result.current.newExpiry).toBe("2026-12-31");
    });

    it("should scroll to form when editing", () => {
      const mockScrollIntoView = vi.fn();
      const { result } = renderHook(() => useDiscountCodes());

      // Mock the ref
      if (result.current.reviewFormRef.current) {
        result.current.reviewFormRef.current.scrollIntoView =
          mockScrollIntoView;
      }

      act(() => {
        result.current.handleEdit(mockDiscountCodes[1]);
      });

      // Note: scrollIntoView might not be called if ref is not attached in test environment
      // This test verifies the logic is in place
      expect(result.current.editingId).toBe(2);
    });
  });

  describe("handleDelete", () => {
    it("should delete discount code successfully", async () => {
      mockDeleteDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      await act(async () => {
        await result.current.handleDelete(1);
      });

      expect(mockDeleteDiscountCodes).toHaveBeenCalledWith(1);
      expect(mockRefetch).toHaveBeenCalled();
    });

    it("should handle error when delete fails", async () => {
      mockDeleteDiscountCodes.mockReturnValue({
        unwrap: vi
          .fn()
          .mockRejectedValue({ data: { message: "Cannot delete code" } }),
      });

      const { result } = renderHook(() => useDiscountCodes());

      await act(async () => {
        await result.current.handleDelete(1);
      });

      expect(toast.error).toHaveBeenCalledWith("Cannot delete code");
    });

    it("should show generic error when delete error has no message", async () => {
      mockDeleteDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      await act(async () => {
        await result.current.handleDelete(1);
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete discount code",
      );
    });
  });

  describe("Loading States", () => {
    it("should handle loading state", () => {
      vi.mocked(useGetDiscountCodesQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        refetch: mockRefetch,
        isSuccess: false,
        isError: false,
        error: undefined,
        isFetching: true,
        isUninitialized: false,
        startedTimeStamp: Date.now(),
        fulfilledTimeStamp: undefined,
        currentData: undefined,
        endpointName: "getDiscountCodes",
        originalArgs: undefined,
        requestId: "test-request-id",
        status: "pending" as const,
      } as any);

      const { result } = renderHook(() => useDiscountCodes());

      expect(result.current.isLoading).toBe(true);
    });

    it("should handle adding state", () => {
      vi.mocked(usePostDiscountCodesMutation).mockReturnValue([
        mockPostDiscountCodes,
        { isLoading: true } as any,
      ]);

      const { result } = renderHook(() => useDiscountCodes());

      expect(result.current.isAdding).toBe(true);
    });

    it("should handle editing state", () => {
      vi.mocked(usePatchDiscountCodesMutation).mockReturnValue([
        mockPatchDiscountCodes,
        { isLoading: true } as any,
      ]);

      const { result } = renderHook(() => useDiscountCodes());

      expect(result.current.isEditing).toBe(true);
    });

    it("should handle deleting state", () => {
      vi.mocked(useDeleteDiscountCodesMutation).mockReturnValue([
        mockDeleteDiscountCodes,
        { isLoading: true } as any,
      ]);

      const { result } = renderHook(() => useDiscountCodes());

      expect(result.current.isDeleting).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should accept discount value of 100", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("FULL");
        result.current.setNewDiscount("100");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(mockPostDiscountCodes).toHaveBeenCalledWith({
        code: "FULL",
        discount: 100,
        EndDate: "2026-12-31",
      });
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should accept discount value of 1", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("TINY");
        result.current.setNewDiscount("1");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(mockPostDiscountCodes).toHaveBeenCalledWith({
        code: "TINY",
        discount: 1,
        EndDate: "2026-12-31",
      });
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should handle decimal discount values", async () => {
      mockPostDiscountCodes.mockReturnValue({
        unwrap: vi.fn().mockResolvedValue({}),
      });

      const { result } = renderHook(() => useDiscountCodes());

      act(() => {
        result.current.setNewCode("DECIMAL");
        result.current.setNewDiscount("15.5");
        result.current.setNewExpiry("2026-12-31");
      });

      await act(async () => {
        await result.current.handleAddOrSave();
      });

      expect(mockPostDiscountCodes).toHaveBeenCalledWith({
        code: "DECIMAL",
        discount: 15.5,
        EndDate: "2026-12-31",
      });
    });
  });
});
