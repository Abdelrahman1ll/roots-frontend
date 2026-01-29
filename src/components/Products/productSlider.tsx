import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";
import { useGetProductsQuery } from "../../redux/products/apiProducts";
import type { ProductType } from "../../types/ProductType";
import { useNavigate } from "react-router-dom";
import { getCloudinaryUrl, getCloudinarySrcSet } from "../../utils/cloudinary";

/**
 * ProductSlider: Horizontal draggable slider for featured products.
 * منزلق المنتجات: منزلق أفقي قابل للسحب للمنتجات المميزة.
 */
export default function ProductSlider() {
  const navigate = useNavigate();

  const { data: products, isLoading } = useGetProductsQuery("/products");

  // Persist index state to restore position when navigating back
  const [index, setIndex] = useState(() => {
    const saved = sessionStorage.getItem("product-slider-index");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isGrabbing, setIsGrabbing] = useState(false);

  // Sync index to session storage
  useEffect(() => {
    sessionStorage.setItem("product-slider-index", index.toString());
  }, [index]);

  // Validate index against loaded products
  useEffect(() => {
    if (products?.products && index >= products.products.length) {
      setIndex(0);
    }
  }, [products, index]);

  const next = () => {
    if (products?.products && index < products.products.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full py-12 flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Navigation Buttons - Minimal Slim */}
      <div className="absolute inset-x-4 md:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-50 max-w-7xl mx-auto w-full">
        <motion.button
          whileHover={index > 0 ? { scale: 1.05, x: -2 } : {}}
          whileTap={index > 0 ? { scale: 0.95 } : {}}
          onClick={prev}
          disabled={index === 0}
          className={`pointer-events-auto hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border border-(--color-border) text-(--color-dark) shadow-sm transition-all duration-300 group ${
            index === 0
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-(--color-dark) hover:text-white cursor-pointer"
          }`}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </motion.button>

        <motion.button
          whileHover={
            products?.products && index < products.products.length - 1
              ? { scale: 1.05, x: 2 }
              : {}
          }
          whileTap={
            products?.products && index < products.products.length - 1
              ? { scale: 0.95 }
              : {}
          }
          onClick={next}
          disabled={
            !products?.products || index >= products.products.length - 1
          }
          className={`pointer-events-auto hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border border-(--color-border) text-(--color-dark) shadow-sm transition-all duration-300 group ${
            !products?.products || index >= products.products.length - 1
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-(--color-dark) hover:text-white cursor-pointer"
          }`}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Slider Container */}
      <div className="w-full max-w-6xl px-4 overflow-visible z-10">
        <motion.div
          className={`flex gap-6 ${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
          animate={{ x: `calc(-${index * 100}% - ${index * 1.5}rem)` }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 25,
            mass: 1,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onPointerDown={() => setIsGrabbing(true)}
          onPointerUp={() => setIsGrabbing(false)}
          onPointerLeave={() => setIsGrabbing(false)}
          onDragEnd={(_, info) => {
            setIsGrabbing(false);
            if (info.offset.x < -40 && info.velocity.x < 0) next();
            else if (info.offset.x > 40 && info.velocity.x > 0) prev();
          }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-full md:min-w-[45%] flex flex-col items-center justify-center"
              >
                <div className="rounded-2xl w-full aspect-3/4 bg-gray-50 animate-pulse" />
              </div>
            ))
          ) : products?.products.length ? (
            products?.products.map((product: ProductType, i: number) => (
              <div
                key={product?.id}
                className="min-w-full md:min-w-[45%] lg:min-w-[32%] flex flex-col items-center justify-center transition-opacity duration-500"
                style={{ opacity: Math.abs(index - i) > 2 ? 0 : 1 }}
              >
                <motion.div
                  className="relative group/card w-full"
                  onClick={() => {
                    if (!isGrabbing) {
                      navigate(`/products-details/${product?.id}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  {/* Card Main - Straight Aesthetic */}
                  <div className="relative overflow-hidden rounded-2xl bg-(--color-earth) border border-(--color-border) aspect-3/4 isolate transition-all duration-500 group-hover/card:border-(--color-dark)/20">
                    {/* Image */}
                    <img
                      src={getCloudinaryUrl(product?.images[0], {
                        width: 800,
                      })}
                      srcSet={getCloudinarySrcSet(product?.images[0])}
                      sizes="(max-width: 640px) 100vw, 400px"
                      alt={product?.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                      draggable={false}
                    />

                    {/* Minimal Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    {/* Quick View Link (Desktop Only) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <span className="px-6 py-2 bg-white text-(--color-dark) text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Info Below Card - Minimal & Clean */}
                  <div className="mt-6 flex flex-col items-center text-center">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-(--color-tiger) mb-2">
                      {typeof product.category === "object"
                        ? (product.category as any).name
                        : product.category}
                    </span>
                    <h3 className="text-xl font-bold text-(--color-pakistan) tracking-tight mb-1">
                      {product?.name}
                    </h3>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-(--color-dark)">
                        {product?.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider opacity-40">
                        EGP
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <div className="min-w-full flex items-center justify-center p-20">
              <div className="text-center opacity-30">
                <PackageSearch size={40} className="mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">
                  No products found
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Pagination Indicators - Slim Lines */}
      <div className="flex items-center gap-2 mt-12 z-20">
        {products?.products.slice(0, 8).map((_: ProductType, i: number) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group relative h-4 flex items-center px-1"
          >
            <motion.div
              className={`h-0.5 transition-all duration-500 ${
                i === index
                  ? "w-12 bg-(--color-dark)"
                  : "w-4 bg-(--color-border) group-hover:bg-gray-300"
              }`}
              layoutId="slider-indicator-slim"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
