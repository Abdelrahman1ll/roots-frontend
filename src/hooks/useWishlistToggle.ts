import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import {
  useDeleteWishlistMutation,
  useGetWishlistQuery,
  usePostWishlistMutation,
} from "../redux/wishlist/apiWishlist";

// Define a basic interface for wishlist item to avoid 'any'
interface WishlistItem {
  id: number;
  product: {
    id: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * useWishlistToggle: Logic for managing favorite status and wishlist updates.
 * خطاف الأمنيات: منطق إدارة حالة التفضيل وتحديث قائمة الأمنيات.
 */
export function useWishlistToggle() {
  const { user } = useContext(AuthContext);
  // Track favorite status for each product | تتبع حالة التفضيل لكل منتج
  const [isFav, setIsFav] = useState<{ [key: number]: boolean }>({});

  const [postWishlist] = usePostWishlistMutation();
  const [deleteWishlist] = useDeleteWishlistMutation();

  // Fetch wishlist data only if user is logged in | جلب بيانات قائمة الأمنيات فقط إذا كان المستخدم مسجلاً
  const { data, refetch, isLoading } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  // Synchronize 'isFav' state with fetched wishlist data | مزامنة حالة 'isFav' مع بيانات قائمة الأمنيات المجلوبة
  useEffect(() => {
    if (data?.wishlist) {
      const favStatus: { [key: number]: boolean } = {};
      data.wishlist.forEach((item: WishlistItem) => {
        favStatus[item.product.id] = true;
      });
      setIsFav(favStatus);
    } else {
      setIsFav({});
    }
  }, [data]);

  /**
   * Toggles the wishlist status of a product (Add/Remove).
   * تبديل حالة المنتج في قائمة الأمنيات (إضافة/حذف).
   */
  const handleToggleWishlist = async (productId: number) => {
    if (!user) {
      toast.info("Please login to add items to your wishlist");
      return;
    }

    try {
      // Find if the product is already in the wishlist | التحقق مما إذا كان المنتج موجوداً بالفعل في القائمة
      const wishlistItem = data?.wishlist?.find(
        (item: WishlistItem) => String(item.product.id) === String(productId)
      );

      if (wishlistItem) {
        // Remove from wishlist | الحذف من القائمة
        await deleteWishlist(wishlistItem.id).unwrap();
        setIsFav((prev) => ({ ...prev, [productId]: false }));
      } else {
        // Add to wishlist | الإضافة إلى القائمة
        await postWishlist({ product: Number(productId) }).unwrap();
        setIsFav((prev) => ({ ...prev, [productId]: true }));
      }

      refetch();
    } catch {
      toast.error("Failed to toggle favorite");
    }
  };

  return { isFav, handleToggleWishlist, isLoading, wishlist: data?.wishlist };
}
