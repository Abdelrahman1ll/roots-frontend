import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { usePostCartMutation } from "../../redux/Cart/apiCart";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { useGetProductIdQuery } from "../../redux/products/apiProducts";
import type { ProductType } from "../../types/ProductType";
import { SignupContext } from "../../context/SignupContext";
import { useWishlistToggle } from "../../hooks/useWishlistToggle";

/**
 * useProductDetail: Orchestrates the logic for product details, including image navigation, size selection, and cart/wishlist actions.
 * خطاف تفاصيل المنتج: يدير منطق تفاصيل المنتج، بما في ذلك التنقل بين الصور، اختيار المقاس، وإجراءات السلة/الأمنيات.
 */
export default function useProductDetail() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const { data: products, isLoading, isFetching } = useGetProductIdQuery(id);
  const { openSignup } = useContext(SignupContext);

  const product: ProductType = products?.product;
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const { isFav, handleToggleWishlist: toggleWishlist } = useWishlistToggle();

  const [postCart] = usePostCartMutation();

  const handleToggleWishlist = () => toggleWishlist(Number(id));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const mainImage =
    product?.images && product.images.length > 0
      ? product.images[currentIndex]
      : "";

  const handleNext = () => {
    if (!product?.images?.length) return;
    setCurrentIndex((prevIndex: number) =>
      prevIndex === product?.images?.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrev = () => {
    if (!product?.images?.length) return;
    setCurrentIndex((prevIndex: number) =>
      prevIndex === 0 ? product?.images?.length - 1 : prevIndex - 1,
    );
  };

  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => Math.min(prev + 1, 10)); // أقصى 10
  const decrease = () => setQuantity((prev) => Math.max(prev - 1, 1)); // أدنى 1

  const percentstock =
    Math.min((product?.stock / product?.total_stock) * 100, 100) || 0;
  const getColor = () => {
    if (percentstock > 60) return "var(--color-tiger)"; // أخضر
    if (percentstock > 30) return "var(--color-dark)"; // برتقالي
    return "#A80000"; // أحمر
  };

  const [errors, setErrors] = useState<{
    selectedSize: string | null;
    quantity: string | null;
    id: string | null;
  }>({
    selectedSize: null,
    quantity: null,
    id: null,
  });

  const addToCart = async () => {
    // التحقق من تسجيل الدخول
    if (!user) {
      openSignup();
      return;
    }

    if (user.role !== "user") {
      toast.error("I'm not allowed to admin");
      return;
    }
    const newErrors: {
      selectedSize: string | null;
      quantity: string | null;
      id: string | null;
    } = {
      selectedSize: null,
      quantity: null,
      id: null,
    };

    if (!selectedSize) newErrors.selectedSize = "Please select a size";
    if (!id) newErrors.id = "Invalid product";
    if (!quantity || quantity === 0)
      newErrors.quantity = "Quantity must be greater than 0";

    // لو في أي Error وقف
    if (newErrors.selectedSize || newErrors.quantity || newErrors.id) {
      setErrors(newErrors);
      return;
    }
    try {
      await postCart({
        product: Number(id),
        quantity: quantity,
        sizes: selectedSize,
      }).unwrap();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to add item to cart");
    }
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  return {
    product,
    isFav: isFav[Number(id)],
    handleToggleWishlist,
    mainImage,
    handleNext,
    handlePrev,
    quantity,
    increase,
    decrease,
    percentstock,
    getColor,
    errors,
    addToCart,
    selectedSize,
    setSelectedSize,
    isLoading,
    isFetching,
    setCurrentIndex,
    isFullScreen,
    setIsFullScreen,
  };
}
