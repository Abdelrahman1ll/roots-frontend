import { motion, type Variants } from "framer-motion";
import { PackageSearch, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import React, { memo, useContext } from "react";
import type { ProductType } from "../../types/ProductType";
import type { UserType } from "../../types/UserType";
import { getCloudinaryUrl, getCloudinarySrcSet } from "../../utils/cloudinary";
import useProduct from "./useProduct";
import { usePostCartMutation } from "../../redux/Cart/apiCart";
import { SignupContext } from "../../context/SignupContext";
import { toast } from "react-toastify";
import type { ProductSizeType } from "../../types/ProductType";

// Variants for staggered children animation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Loading skeleton for the product list
 */
const ProductSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-transparent flex flex-col animate-pulse">
        <div className="w-full h-[460px] rounded-3xl bg-gray-200 mb-4" />
        <div className="flex justify-between mb-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="flex flex-col items-end">
            <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </>
);

/**
 * Individual Product Card component
 */
const ProductCard = memo(
  ({
    product,
    isFav,
    isHovered,
    user,
    setHoveredIds,
    handleToggleWishlist,
  }: {
    product: ProductType;
    isFav: boolean;
    isHovered: boolean;
    user: UserType | null;
    setHoveredIds: React.Dispatch<
      React.SetStateAction<Record<number, boolean>>
    >;
    handleToggleWishlist: (id: number) => void;
  }) => {
    const isOutOfStock = product.stock === 0;
    const [postCart, { isLoading: isAdding }] = usePostCartMutation();
    const { openSignup } = useContext(SignupContext);

    const handleQuickAdd = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        openSignup();
        return;
      }

      if (user.role !== "user") {
        toast.error("Administrators cannot add items to cart");
        return;
      }

      // Find first available size
      const availableSize = product.sizes?.find(
        (s: ProductSizeType) => s.stock > 0,
      );

      if (!availableSize) {
        toast.error("Product is out of stock");
        return;
      }

      try {
        await postCart({
          product: product.id,
          quantity: 1,
          sizes: availableSize.id,
        }).unwrap();
        toast.success(`${product.name} added to cart`);
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to add to cart");
      }
    };

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="group/card relative flex flex-col bg-white"
        onMouseEnter={() =>
          setHoveredIds((prev) => ({ ...prev, [product.id]: true }))
        }
        onMouseLeave={() =>
          setHoveredIds((prev) => ({ ...prev, [product.id]: false }))
        }
      >
        {/* Image Container */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-white">
          <Link
            to={`/products-details/${product.id}`}
            className="block h-full w-full"
          >
            <div className="relative h-full w-full overflow-hidden">
              {/* Primary Image */}
              <motion.img
                loading="lazy"
                src={getCloudinaryUrl(product.images[0], { width: 600 })}
                srcSet={getCloudinarySrcSet(product.images[0])}
                sizes="(max-width: 640px) 400px, 600px"
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Secondary Image - Crossfade */}
              {product.images[1] && (
                <motion.img
                  src={getCloudinaryUrl(product.images[1], { width: 600 })}
                  srcSet={getCloudinarySrcSet(product.images[1])}
                  sizes="(max-width: 640px) 400px, 600px"
                  alt={`${product.name} alternate`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </div>
          </Link>

          {/* Premium Quick Add Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pointer-events-auto"
            >
              <button
                onClick={handleQuickAdd}
                disabled={isAdding || isOutOfStock}
                className="w-full bg-white text-(--color-dark) py-4 text-[9px] font-bold tracking-[0.3em] uppercase transition-all shadow-2xl border border-gray-100 hover:bg-(--color-dark) hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding
                  ? "Synchronizing..."
                  : isOutOfStock
                    ? "Out of Archive"
                    : "Quick Add to Bag"}
              </button>
            </motion.div>
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => handleToggleWishlist(product.id)}
            className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            } bg-white hover:bg-black group/fav`}
            aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className={`${
                isFav
                  ? "fill-red-500 stroke-red-500"
                  : "fill-transparent stroke-(--color-dark) group-hover/fav:stroke-white"
              } transition-all duration-300`}
            />
          </button>

          {/* Label (Sale/Status) */}
          {product.discountPercentage !== 0 && product.stock > 0 && (
            <div className="absolute top-4 left-0 bg-(--color-dark) text-white px-4 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase z-10">
              {product.discountPercentage}% OFF
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-4 left-0 bg-white border border-gray-100 text-(--color-dark) px-4 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase z-10">
              Sold Out
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-4 space-y-2">
          <Link to={`/products-details/${product.id}`} className="block">
            <h3 className="text-xs font-semibold tracking-wider text-(--color-dark) uppercase hover:opacity-60 transition-opacity">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-(--color-dark)">
              {product.price.toLocaleString()} EGP
            </span>
            {product.discountPercentage !== 0 && (
              <span className="text-xs font-medium text-gray-400 line-through">
                {product.promotionalPrice.toLocaleString()} EGP
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

ProductCard.displayName = "ProductCard";

/**
 * Product: Grid display of products with search and filter results.
 * المنتج: عرض شبكة المنتجات مع نتائج البحث والتصفية.
 */
export default function Product() {
  const {
    products,
    isLoading,
    isFav,
    handleToggleWishlist,
    hoveredIds,
    setHoveredIds,
    user,
    isError,
    isFetching,
  } = useProduct();

  const productList = products?.products || [];

  return (
    <div className="m-4">
      <section className="w-full mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading && !isFetching ? (
            <ProductSkeleton />
          ) : productList.length === 0 || isError ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-(--color-tiger)/10 rounded-full flex items-center justify-center mb-6">
                <PackageSearch size={40} className="text-(--color-tiger)" />
              </div>
              <p className="text-(--color-dark)/70 font-black uppercase tracking-widest text-xs">
                No products found
              </p>
            </div>
          ) : (
            productList.map((product: ProductType) => (
              <ProductCard
                key={product.id}
                product={product}
                isFav={isFav[product.id]}
                isHovered={hoveredIds[product.id] || false}
                user={user}
                setHoveredIds={setHoveredIds}
                handleToggleWishlist={handleToggleWishlist}
              />
            ))
          )}
        </motion.div>
      </section>
    </div>
  );
}
