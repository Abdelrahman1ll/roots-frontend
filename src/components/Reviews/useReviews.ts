import {
  usePostReviewsMutation,
  useGetReviewsQuery,
  usePatchReviewsMutation,
  useDeleteReviewsMutation,
} from "../../redux/reviews/apiReviews";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import type { ReviewType } from "../../types/ReviewsType";
/**
 * useReviews: Logic for fetching, posting, and deleting product reviews.
 * خطاف المراجعات: منطق جلب ونشر وحذف مراجعات المنتجات.
 */
export default function useReviews() {
  const { id } = useParams();
  const { data: reviewsData, refetch } = useGetReviewsQuery(id);
  const [postReviews] = usePostReviewsMutation();
  const [patchReviews] = usePatchReviewsMutation();
  const [deleteReviews] = useDeleteReviewsMutation();
  const reviewFormRef = useRef<HTMLDivElement>(null);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReviews(reviewId).unwrap();
      toast.success("Review deleted successfully!");
      setNewRating(0);
      setNewComment("");
      refetch();
    } catch {
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const [editingReview, setEditingReview] = useState<ReviewType | null>(null);

  const handleEditReview = (review: ReviewType) => {
    // تحميل بيانات الريفيو القديم إلى النموذج
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment);
    reviewFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmitReview = async () => {
    if (!newRating || !newComment.trim()) {
      toast.error("Please enter a rating and comment.");
      return;
    }

    try {
      if (editingReview) {
        // تعديل الريفيو القديم
        await patchReviews({
          id: editingReview.id,
          data: {
            rating: newRating,
            comment: newComment,
          },
        }).unwrap();
        toast.success("Review updated successfully!");
        setEditingReview(null);
      } else {
        // إضافة ريفيو جديد
        await postReviews({
          rating: newRating,
          comment: newComment,
          product: Number(id),
        }).unwrap();
        toast.success("Review added successfully!");
      }

      setNewRating(0);
      setNewComment("");
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      if (err?.data?.message?.includes("Error in RolesGuard")) {
        toast.error("You are not allowed to add a review.");
      } else if (
        err?.data?.message?.includes("You have already reviewed this product")
      ) {
        toast.error("You have already reviewed this product.");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    }
  };

  return {
    reviewsData,
    handleDeleteReview,
    handleEditReview,
    handleSubmitReview,
    newRating,
    setNewRating,
    newComment,
    setNewComment,
    hoverRating,
    setHoverRating,
    reviewFormRef,
    editingReview,
  };
}
