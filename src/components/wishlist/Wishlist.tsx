import { motion, type Variants } from "framer-motion";
import { PackageSearch, X } from "lucide-react";
import type { ProductType } from "../../types/ProductType";

import { Link } from "react-router-dom";
import UseWishlist from "./useWishlist";
import React, { useContext } from "react";
import { usePostCartMutation } from "../../redux/Cart/apiCart";
import { SignupContext } from "../../context/SignupContext";
import { toast } from "react-toastify";
import type { ProductSizeType } from "../../types/ProductType";
import { getCloudinaryUrl, getCloudinarySrcSet } from "../../utils/cloudinary";

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
 * Loading skeleton for the wishlist
 */
const WishlistSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-transparent flex flex-col animate-pulse">
        <div className="w-full h-[460px] bg-gray-200 mb-4" />
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
 * Wishlist: Displays the user's favorite products.
 * قائمة الأمنيات: عرض المنتجات التي يفضلها المستخدم.
 */
export default function Wishlist() {
  const { handleToggleWishlist, isLoading, user, data } = UseWishlist();
  const [hoveredIds, setHoveredIds] = React.useState<Record<number, boolean>>(
    {},
  );

  const [postCart, { isLoading: isAdding }] = usePostCartMutation();
  const { openSignup } = useContext(SignupContext);

  const handleQuickAdd = async (e: React.MouseEvent, product: ProductType) => {
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
    <div className="py-14 m-4">
      <section className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            <WishlistSkeleton />
          ) : data?.wishlist?.length ? (
            data?.wishlist.map(
              (wishl: { product: ProductType }, index: number) => {
                const product = wishl.product;
                const isHovered = hoveredIds[product.id] || false;
                const isOutOfStock = product.stock === 0;

                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group/card relative flex flex-col bg-white"
                    onMouseEnter={() =>
                      setHoveredIds((prev) => ({ ...prev, [product.id]: true }))
                    }
                    onMouseLeave={() =>
                      setHoveredIds((prev) => ({
                        ...prev,
                        [product.id]: false,
                      }))
                    }
                  >
                    {/* Main Image Container */}
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-white">
                      <Link
                        to={`/products-details/${product.id}`}
                        className="block h-full w-full"
                      >
                        <div className="relative h-full w-full overflow-hidden">
                          {/* Primary Image */}
                          <motion.img
                            loading="lazy"
                            src={getCloudinaryUrl(product.images[0], {
                              width: 600,
                            })}
                            srcSet={getCloudinarySrcSet(product.images[0])}
                            sizes="(max-width: 640px) 400px, 600px"
                            alt={product.name}
                            className="absolute inset-0 h-full w-full object-cover p-0"
                            animate={{
                              scale: isHovered ? 1.05 : 1,
                            }}
                            transition={{
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />

                          {/* Secondary Image - Crossfade */}
                          {product.images[1] && (
                            <motion.img
                              src={getCloudinaryUrl(product.images[1], {
                                width: 600,
                              })}
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
                          animate={
                            isHovered
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: 10 }
                          }
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="pointer-events-auto"
                        >
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
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

                      {/* Remove Button - Minimalist X icon */}
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-none flex items-center justify-center transition-all ${
                          isHovered ? "opacity-100" : "opacity-0"
                        } bg-white hover:bg-black group/fav`}
                        aria-label="Remove from wishlist"
                      >
                        <X
                          size={16}
                          className="stroke-black group-hover/fav:stroke-white transition-all duration-300"
                        />
                      </button>

                      {/* Label (Sale/Status) */}
                      {product.discountPercentage !== 0 && !isOutOfStock && (
                        <div className="absolute top-4 left-0 bg-black text-white px-4 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase z-10">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute top-4 left-0 bg-white border border-gray-100 text-black px-4 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase z-10">
                          Sold Out
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="pt-4 space-y-2">
                      <Link
                        to={`/products-details/${product.id}`}
                        className="block"
                      >
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

                      {/* Management Controls */}
                      {user && user.role !== "user" && (
                        <Link
                          to={`/edit-product/${product.id}`}
                          className="block mt-4"
                        >
                          <motion.button className="w-full bg-black py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white transition-all hover:opacity-80 rounded-none">
                            Management Control
                          </motion.button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              },
            )
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="mb-6 text-gray-100">
                <PackageSearch size={48} strokeWidth={1} />
              </div>
              <p className="text-black font-black uppercase tracking-[0.3em] text-[10px]">
                Null Wishlist Registry
              </p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
