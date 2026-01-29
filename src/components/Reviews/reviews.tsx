import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import type { ReviewType } from "../../types/ReviewsType";
import useReviews from "./useReviews";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useParams } from "react-router-dom";

/**
 * Reviews: Interface for viewing and managing product reviews/ratings.
 * المراجعات: واجهة لعرض وإدارة تقييمات ومراجعات المنتجات.
 */
export default function Reviews({
  limit,
  hideForm,
}: {
  limit?: number;
  hideForm?: boolean;
}) {
  const { id } = useParams();
  const {
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
  } = useReviews();

  const { user } = useContext(AuthContext);

  return (
    <section className="py-10 px-4 bg-(--color-earth)/30 border-t border-(--color-border)">
      <div className="w-full max-w-3xl mx-auto">
        {/* Write a Review Section */}
        {!hideForm && (
          <div
            ref={reviewFormRef}
            className="bg-white rounded-none border border-(--color-border) p-8 mb-16 shadow-sm"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-(--color-dark) mb-1 uppercase tracking-tight">
                {editingReview ? "Edit Review" : "Post a Perspective"}
              </h3>
              <p className="text-xs font-medium text-gray-400">
                Share your experience with the ROOTS community
              </p>
            </div>

            {/* Rating section */}
            <div className="mb-8">
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className="cursor-pointer transition-colors"
                    onClick={() => setNewRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    color={
                      i < (hoverRating || newRating)
                        ? "var(--color-dark)"
                        : "#EEE"
                    }
                    fill={
                      i < (hoverRating || newRating)
                        ? "var(--color-dark)"
                        : "transparent"
                    }
                    strokeWidth={1.5}
                  />
                ))}
              </div>
            </div>

            {/* Comment input */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full bg-(--color-earth)/50 border border-(--color-border) rounded-none p-4 outline-none focus:border-(--color-dark) transition-all text-sm font-medium resize-none"
                placeholder="Your thoughts..."
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmitReview}
              className="w-full py-4 bg-(--color-dark) text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all"
            >
              {editingReview ? "Update Review" : "Publish Review"}
            </button>
          </div>
        )}

        {/* Reviews list */}
        <div className="space-y-6">
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">
              Community Feedback
            </h3>
          </div>

          <AnimatePresence mode="popLayout">
            {reviewsData?.review
              ?.slice(0, limit || reviewsData.review.length)
              .map((review: ReviewType) => (
                <motion.div
                  key={review?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-white border border-(--color-border) rounded-none"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-(--color-earth) flex items-center justify-center text-[11px] font-bold text-(--color-dark)">
                        {review?.user?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-(--color-dark) uppercase tracking-wide">
                          {review?.user?.firstName} {review?.user?.lastName}
                        </h4>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              color={
                                i < review?.rating
                                  ? "var(--color-dark)"
                                  : "#EEE"
                              }
                              fill={
                                i < review?.rating
                                  ? "var(--color-dark)"
                                  : "transparent"
                              }
                              strokeWidth={0}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {review?.createdAt &&
                        new Date(review?.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    {review?.comment}
                  </p>

                  {user?.id === review?.user?.id && (
                    <div className="flex gap-4 justify-end pt-6 border-t border-(--color-border)/50">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-(--color-dark) transition-colors"
                      >
                        Edit Post
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>

          {limit &&
            reviewsData?.review &&
            reviewsData.review.length > limit && (
              <div className="mt-12 flex justify-center">
                <Link
                  to={`/products-details/${id}/reviews`}
                  className="px-10 py-4 border border-(--color-dark) text-(--color-dark) text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-(--color-dark) hover:text-white transition-all duration-300"
                >
                  View All Perspectives ({reviewsData.review.length})
                </Link>
              </div>
            )}

          {reviewsData?.review?.length === 0 && (
            <div className="text-center py-20 opacity-30">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
                No Perspectives Yet
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
