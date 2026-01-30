import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  PackageSearch,
  SquarePen,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductSizeType } from "../../types/ProductType";
import MotionZoomImage from "./ImageZoom";
import useProductDetail from "./useProductDetail";
import AddToCartButton from "./AddToCartButton";

/**
 * ProductDetail: Renders the full details of a specific product, including images, sizes, and stock.
 * تفاصيل المنتج: يعرض التفاصيل الكاملة لمنتج معين، بما في ذلك الصور، المقاسات، وحالة المخزون.
 */
export default function ProductDetail() {
  const {
    product,
    isFav,
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
    user,
  } = useProductDetail();

  const [isFullscreenZoomed, setIsFullscreenZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const handleFullscreenMouseMove = (e: React.MouseEvent) => {
    if (!isFullscreenZoomed || !zoomContainerRef.current) return;
    const { left, top, width, height } =
      zoomContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };
  return (
    <>
      {isLoading && isFetching ? (
        <div className="flex flex-col md:flex-row items-start justify-center gap-10 m-4 mt-12">
          {/* الجزء الأيسر skeleton */}
          <div className="w-full md:w-1/2 animate-pulse flex flex-col gap-4">
            <div className="w-full h-[450px] md:h-[800px] rounded-2xl bg-gray-200" />
            <div className="flex gap-3 mt-4 flex-wrap">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-gray-300" />
              ))}
            </div>
          </div>

          {/* الجزء الأيمن skeleton */}
          <div className="md:w-1/2 flex flex-col gap-6 animate-pulse">
            <div className="h-10 w-3/4 bg-gray-200 rounded"></div>{" "}
            {/* اسم المنتج */}
            <div className="flex items-baseline gap-4">
              <div className="h-8 w-20 bg-gray-200 rounded"></div> {/* السعر */}
              <div className="h-6 w-16 bg-gray-200 rounded"></div>{" "}
              {/* السعر القديم */}
              <div className="h-6 w-12 bg-gray-300 rounded-full"></div>{" "}
              {/* النسبة */}
            </div>
            <div className="h-20 w-full bg-gray-200 rounded"></div> {/* وصف */}
            <div>
              <div className="flex gap-3 flex-wrap">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-gray-300 rounded-full" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>
            <div className="mt-4 w-full">
              <div className="flex justify-between mb-1">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden"></div>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="h-12 flex-1 bg-gray-300 rounded-full"></div>{" "}
              {/* زر Add to Cart */}
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>{" "}
              {/* زر القلب */}
            </div>
          </div>
        </div>
      ) : !product ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <PackageSearch
            size={100}
            className="text-(--color-tiger) mb-6 animate-bounce"
          />
          <p className="text-gray-500 text-lg font-medium">
            Sorry, this product is not available.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-start justify-center gap-6 md:gap-10 m-4 mt-12">
          <motion.div
            className="relative overflow-hidden w-full md:w-1/2 bg-white pt-4 md:pt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Primary Image Container */}
            <div
              className="relative overflow-hidden rounded-none cursor-zoom-in"
              onClick={() => setIsFullScreen(true)}
            >
              <MotionZoomImage mainImage={mainImage} product={product} />

              {/* Navigation Arrows - Minimal Gray Circular */}
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-10">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#E5E5E5" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="pointer-events-auto bg-(--color-gray-soft) text-(--color-dark) p-4 rounded-full shadow-sm transition-all cursor-pointer"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#E5E5E5" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="pointer-events-auto bg-(--color-gray-soft) text-(--color-dark) p-4 rounded-full shadow-sm transition-all cursor-pointer"
                >
                  <ChevronRight size={20} strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>

            {/* Thumbnails - Straight & Slim */}
            <div className="flex justify-start flex-wrap gap-2">
              {Array.isArray(product?.images) &&
                product?.images?.map((img: string, index: number) => (
                  <motion.div
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-24 h-24 overflow-hidden rounded-none cursor-pointer transition-all duration-300 ${
                      mainImage === img
                        ? "opacity-100 ring-2 ring-(--color-dark) ring-inset"
                        : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img || "/photo-1495385794356-15371f348c31.jpeg"}
                      alt={`${product?.name} perspective ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 flex flex-col gap-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">
                  {typeof product.category === "object" &&
                  product.category !== null
                    ? (product.category as unknown as { name: string }).name
                    : product.category || "ROOTS Collection"}
                </span>
                <div className="w-8 h-px bg-gray-200" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-(--color-dark) leading-[1.05] uppercase">
                {product?.name}
              </h2>

              {(user?.role === "owner" || user?.role === "admin") && (
                <Link
                  to={`/edit-product/${product.id}`}
                  className="w-fit flex items-center gap-2 px-4 py-2 bg-gray-100/50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  <SquarePen size={14} />
                  <span>Edit Product</span>
                </Link>
              )}
            </div>

            {/* السعر بريميوم */}
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-(--color-tiger)">
                  {product?.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold uppercase opacity-60 tracking-wider">
                  EGP
                </span>
              </div>

              {product?.promotionalPrice !== 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-xl font-medium text-gray-300 line-through decoration-1">
                    EGP {product?.promotionalPrice.toLocaleString()}
                  </p>
                  <div className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    -{product?.discountPercentage.toFixed(0)}%
                  </div>
                </div>
              )}
            </div>

            {/* وصف بسيط */}
            <p className="text-(--color-pakistan) leading-relaxed">
              {product?.description}
            </p>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">
                  Select Size
                </h4>
                <div className="w-8 h-px bg-gray-200" />
              </div>
              <div className="flex gap-3 flex-wrap">
                {Array.isArray(product?.sizes) &&
                  product?.sizes?.map(
                    (size: ProductSizeType, index: number) => {
                      if (!size.size) return null;
                      const isOutOfStock =
                        size.stock === 0 || product.stock === 0;
                      const isSelected = selectedSize === size.id;
                      return (
                        <motion.button
                          key={index}
                          onClick={() => setSelectedSize(size.id ?? null)}
                          whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                          disabled={isOutOfStock}
                          className={`relative h-12 w-16 flex items-center justify-center rounded-none text-xs font-bold transition-all duration-300 ${
                            isOutOfStock
                              ? "bg-gray-50 text-gray-300 cursor-not-allowed border border-dashed border-gray-200"
                              : isSelected
                                ? "bg-(--color-dark) text-white border border-(--color-dark)"
                                : "bg-white text-gray-500 border border-gray-100 hover:border-(--color-dark) hover:text-(--color-dark)"
                          }`}
                        >
                          {size.size}
                          {isOutOfStock && (
                            <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gray-300 -rotate-45" />
                          )}
                        </motion.button>
                      );
                    },
                  )}
              </div>
              {selectedSize && (
                <div className="mt-4 p-4 bg-gray-50 rounded-none border border-gray-100 w-full md:w-fit">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-pakistan)">
                    {(() => {
                      const selected = product?.sizes?.find(
                        (size) => size.id === selectedSize,
                      );
                      if (!selected) return null;

                      return (
                        <>
                          <span className="font-semibold text-(--color-tiger)">
                            Size: {selected.size}
                          </span>

                          <span className="ml-2 text-(--color-dark)">
                            (
                            <span className="font-medium text-(--color-pakistan)">
                              Length:
                            </span>{" "}
                            {selected.length} cm —{" "}
                            <span className="font-medium text-(--color-pakistan)">
                              Width:
                            </span>{" "}
                            {selected.width} cm )
                          </span>
                        </>
                      );
                    })()}
                  </p>
                </div>
              )}
              {errors.selectedSize && (
                <p className="text-red-500 text-sm">{errors.selectedSize}</p>
              )}
            </div>

            <div className="">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">
                  Quantity
                </span>
                <div className="w-8 h-px bg-gray-200" />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white border border-gray-100 rounded-none overflow-hidden">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={decrease}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-(--color-dark) hover:bg-gray-100 transition-colors cursor-pointer border-r border-gray-100"
                  >
                    −
                  </motion.button>

                  <span className="w-14 text-center text-xs font-bold text-(--color-dark) tracking-widest">
                    {quantity}
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={increase}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-(--color-dark) hover:bg-gray-100 transition-colors cursor-pointer border-l border-gray-100"
                  >
                    +
                  </motion.button>
                </div>
              </div>
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>

            <div className="w-full">
              <div className="flex justify-between mb-1 text-sm font-semibold text-[--color-dark]">
                <span>Available Stock</span>
              </div>

              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                <motion.div
                  className="h-full rounded-full shadow-[0_0_10px_rgba(188,108,37,0.3)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${percentstock}%`,
                    backgroundColor: getColor(),
                  }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-8">
              <AddToCartButton addToCart={addToCart} />

              {/* زر القلب جنب الزر */}
              <motion.button
                onClick={handleToggleWishlist}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#F9F9F9",
                }}
                whileTap={{ scale: 0.9 }}
                className="p-5 border border-(--color-border) bg-white cursor-pointer transition-all duration-300"
              >
                <Heart
                  size={24}
                  className={`transition-all duration-500 ${
                    isFav
                      ? "fill-(--color-dark) stroke-(--color-dark)"
                      : "fill-transparent stroke-gray-900"
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center"
          >
            {/* Header / Actions */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">
                {product.name}
              </span>
              <button
                onClick={() => setIsFullScreen(false)}
                className="p-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Container (Thumbnails + Image) */}
            <div className="relative w-full h-full flex items-center justify-center md:px-12 overflow-hidden">
              <div className="flex items-center gap-4 w-full h-full max-w-7xl">
                {/* Side Thumbnails (Left) - Desktop Only */}
                <div className="hidden md:flex flex-col gap-3 z-20">
                  {product.images?.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-16 h-20 overflow-hidden rounded-none transition-all duration-300 border ${
                        mainImage === img
                          ? "border-black scale-105 opacity-100"
                          : "border-transparent opacity-40 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image View */}
                <div
                  ref={zoomContainerRef}
                  onMouseMove={handleFullscreenMouseMove}
                  onClick={() => setIsFullscreenZoomed(!isFullscreenZoomed)}
                  className="flex-1 h-full relative flex items-center justify-center p-1 md:p-2 overflow-hidden cursor-zoom-in"
                >
                  <motion.img
                    key={mainImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: isFullscreenZoomed ? 2.5 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    src={mainImage}
                    alt={product.name}
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }}
                    className={`max-w-full max-h-full object-contain shadow-2xl transition-transform duration-100 ease-out ${
                      isFullscreenZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                  />

                  {/* Navigation Arrows (Relative to Image Area) */}
                  <div className="absolute inset-x-2 md:inset-x-6 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="pointer-events-auto p-4 md:p-5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full border border-black/5 transition-all group cursor-pointer"
                    >
                      <ChevronLeft
                        size={24}
                        className="text-black group-hover:scale-110 transition-transform"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="pointer-events-auto p-4 md:p-5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full border border-black/5 transition-all group cursor-pointer"
                    >
                      <ChevronRight
                        size={24}
                        className="text-black group-hover:scale-110 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Thumbnails (Mobile Only) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex md:hidden gap-2 p-3 bg-white/10 backdrop-blur-sm border border-black/5 z-20">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-12 h-16 overflow-hidden rounded-none transition-all duration-300 border ${
                    mainImage === img
                      ? "border-black opacity-100"
                      : "border-transparent opacity-40"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
