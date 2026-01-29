import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useWishlistToggle } from "../../hooks/useWishlistToggle";

/**
 * useWishlist: Logic for handling wishlist products and image slider.
 * خطاف الأمنيات: منطق معالجة منتجات الأمنيات وشريط عرض الصور.
 */
export default function UseWishlist() {
  const { user } = useContext(AuthContext);
  const { isFav, handleToggleWishlist, isLoading, wishlist } =
    useWishlistToggle();
  const [currentImage, setCurrentImage] = useState<{ [key: number]: number }>(
    {}
  );

  const nextImage = (id: number, total: number) => {
    setCurrentImage((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % total,
    }));
  };

  const prevImage = (id: number, total: number) => {
    setCurrentImage((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) === 0 ? total - 1 : (prev[id] || 0) - 1,
    }));
  };

  return {
    handleToggleWishlist,
    isFav,
    isLoading,
    currentImage,
    nextImage,
    prevImage,
    user,
    data: { wishlist },
  };
}
