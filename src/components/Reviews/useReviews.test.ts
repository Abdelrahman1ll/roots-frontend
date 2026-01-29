import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useReviews from "./useReviews";
import * as apiReviews from "../../redux/reviews/apiReviews";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

vi.mock("../../redux/reviews/apiReviews");
vi.mock("react-router-dom");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useReviews Hook", () => {
  const mockId = "123";
  const mockRefetch = vi.fn();
  const mockPostReviews = vi.fn();
  const mockPatchReviews = vi.fn();
  const mockDeleteReviews = vi.fn();
  const mockUnwrap = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ id: mockId });

    mockPostReviews.mockReturnValue({ unwrap: mockUnwrap });
    mockPatchReviews.mockReturnValue({ unwrap: mockUnwrap });
    mockDeleteReviews.mockReturnValue({ unwrap: mockUnwrap });

    vi.mocked(apiReviews.useGetReviewsQuery).mockReturnValue({
      data: { review: [] },
      refetch: mockRefetch,
    } as any);

    vi.mocked(apiReviews.usePostReviewsMutation).mockReturnValue([
      mockPostReviews,
    ] as any);
    vi.mocked(apiReviews.usePatchReviewsMutation).mockReturnValue([
      mockPatchReviews,
    ] as any);
    vi.mocked(apiReviews.useDeleteReviewsMutation).mockReturnValue([
      mockDeleteReviews,
    ] as any);
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useReviews());
    expect(result.current.newRating).toBe(0);
    expect(result.current.newComment).toBe("");
    expect(result.current.showReviews).toBe(false);
    expect(result.current.editingReview).toBeNull();
  });

  it("handles rating and comment changes", () => {
    const { result } = renderHook(() => useReviews());

    act(() => {
      result.current.setNewRating(5);
      result.current.setNewComment("Great!");
    });

    expect(result.current.newRating).toBe(5);
    expect(result.current.newComment).toBe("Great!");
  });

  it("submits a new review successfully", async () => {
    const { result } = renderHook(() => useReviews());
    mockUnwrap.mockResolvedValue({});

    act(() => {
      result.current.setNewRating(5);
      result.current.setNewComment("Excellent");
    });

    await act(async () => {
      await result.current.handleSubmitReview();
    });

    expect(mockPostReviews).toHaveBeenCalledWith({
      rating: 5,
      comment: "Excellent",
      product: Number(mockId),
    });
    expect(toast.success).toHaveBeenCalledWith("Review added successfully!");
    expect(result.current.newRating).toBe(0);
    expect(result.current.newComment).toBe("");
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("updates an existing review successfully", async () => {
    const { result } = renderHook(() => useReviews());
    const existingReview = { id: 1, rating: 3, comment: "Okay", product: 123 };
    mockUnwrap.mockResolvedValue({});

    act(() => {
      result.current.handleEditReview(existingReview as any);
    });

    expect(result.current.editingReview).toEqual(existingReview);
    expect(result.current.newRating).toBe(3);
    expect(result.current.newComment).toBe("Okay");

    act(() => {
      result.current.setNewRating(4);
    });

    await act(async () => {
      await result.current.handleSubmitReview();
    });

    expect(mockPatchReviews).toHaveBeenCalledWith({
      id: 1,
      data: {
        rating: 4,
        comment: "Okay",
      },
    });
    expect(toast.success).toHaveBeenCalledWith("Review updated successfully!");
    expect(result.current.editingReview).toBeNull();
  });

  it("deletes a review successfully", async () => {
    const { result } = renderHook(() => useReviews());
    mockUnwrap.mockResolvedValue({});

    await act(async () => {
      await result.current.handleDeleteReview(1);
    });

    expect(mockDeleteReviews).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith("Review deleted successfully!");
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("handles submission errors correctly", async () => {
    const { result } = renderHook(() => useReviews());
    mockUnwrap.mockRejectedValue({ data: { message: "Error in RolesGuard" } });

    act(() => {
      result.current.setNewRating(5);
      result.current.setNewComment("Trial");
    });

    await act(async () => {
      await result.current.handleSubmitReview();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "You are not allowed to add a review.",
    );
  });

  it("prevents submission if rating or comment is missing", async () => {
    const { result } = renderHook(() => useReviews());

    await act(async () => {
      await result.current.handleSubmitReview();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please enter a rating and comment.",
    );
    expect(mockPostReviews).not.toHaveBeenCalled();
  });
});
