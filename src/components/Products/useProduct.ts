import { useGetProductsQuery } from "../../redux/products/apiProducts";
import { AuthContext } from "../../context/AuthContext";
import { useWishlistToggle } from "../../hooks/useWishlistToggle";
import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * useProduct: Logic for product filtering, sorting, and display.
 * خطاف المنتجات: منطق تصفية وترتيب وعرض المنتجات.
 */
export default function useProduct() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const name = (searchParams.get("name") || "").trim();
  const category = searchParams.get("category") || "";
  const color = searchParams.get("color") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortPrice = searchParams.get("sortPrice") || "";
  const bestSelling = searchParams.get("bestSelling") || "";
  const [hoveredIds, setHoveredIds] = useState<{ [key: string]: boolean }>({});

  // 👇 بناء الـ query string واستخدام useMemo لضمان refetch عند التغير
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (category) params.append("category", category);
    if (color) params.append("color", color);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sortPrice) params.append("sortPrice", sortPrice);
    if (bestSelling) params.append("bestSelling", bestSelling);

    const result = params.toString();
    return result ? `?${result}` : "";
  }, [name, category, color, minPrice, maxPrice, sortPrice, bestSelling]);

  // 👇 جلب المنتجات
  const {
    data: products,
    isLoading,
    isError,
    isFetching,
  } = useGetProductsQuery(`/products${queryString}`);

  const { isFav, handleToggleWishlist } = useWishlistToggle();

  return {
    products,
    isLoading: isLoading || isFetching,
    isFav,
    handleToggleWishlist,
    hoveredIds,
    setHoveredIds,
    user,
    isError,
    isFetching,
  };
}
