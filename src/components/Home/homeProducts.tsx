import { motion, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useGetProductsQuery } from "../../redux/products/apiProducts";
import type { ProductType } from "../../types/ProductType";
import { PackageSearch } from "lucide-react";
import { getCloudinaryUrl, getCloudinarySrcSet } from "../../utils/cloudinary";
import { Link } from "react-router-dom";

/**
 * HomeProducts: Horizontal draggable slider for featured products.
 * منتجات الصفحة الرئيسية: شريط عرض جانبي للمنتجات المميزة.
 */
export default function HomeProducts() {
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery("/products");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const totalScrollWidth = container.scrollWidth;
      const visibleWidth = container.offsetWidth;
      setDragWidth(totalScrollWidth - visibleWidth);
    }
  }, [products]);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden relative bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-tiger) mb-6"
        >
          Trending Now
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-light text-(--color-dark) tracking-tight mb-6 uppercase"
        >
          Curated Archive
        </motion.h2>
        <div className="w-12 h-px bg-(--color-dark)/20 mb-8" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm md:text-base text-(--color-dark)/50 font-medium max-w-md leading-relaxed"
        >
          A selection of our most-loved pieces, curated for universal simplicity
          and elegance.
        </motion.p>
      </div>

      {isLoading ? (
        <div className="flex gap-4 px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] sm:w-[320px] md:w-[400px]"
            >
              <div className="relative overflow-hidden bg-gray-50 animate-pulse aspect-3/4 shadow-sm">
                <div className="absolute bottom-0 w-full p-6 bg-white flex flex-col gap-3">
                  <div className="h-4 w-2/3 bg-gray-100 rounded-sm" />
                  <div className="h-4 w-1/3 bg-gray-100 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products?.products.length === 0 || isError ? (
        <div className="flex flex-col items-center py-20 relative z-10">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <PackageSearch size={32} className="text-gray-300" />
          </div>
          <p className="text-(--color-dark)/30 font-black uppercase tracking-widest text-[10px]">
            No products available
          </p>
        </div>
      ) : (
        <motion.div
          ref={sliderRef}
          className="flex gap-4 pr-8 md:pr-16 active:cursor-grabbing select-none"
          drag="x"
          dragConstraints={{ left: -dragWidth - 100, right: 100 }}
          dragElastic={0.1}
        >
          <div className="shrink-0 w-6 md:w-16 lg:w-24" />

          {products?.products.map((product: ProductType) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="shrink-0 w-[240px] sm:w-[320px] md:w-[400px]"
            >
              <div className="relative overflow-hidden group transition-all duration-700">
                <div className="relative aspect-3/4 overflow-hidden bg-gray-50">
                  <img
                    src={getCloudinaryUrl(product.images[0], { width: 800 })}
                    srcSet={getCloudinarySrcSet(product.images[0])}
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 450px, 800px"
                    alt={product.name}
                    draggable="false"
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110 pointer-events-none"
                  />

                  {product.discountPercentage && (
                    <div className="absolute top-4 left-0 bg-(--color-dark) text-white text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 z-10">
                      Sale {product.discountPercentage}%
                    </div>
                  )}

                  {/* Premium Integrated Info Bar on Hover */}
                  <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                    >
                      <div className="bg-white/95 backdrop-blur-sm p-5 border-t border-gray-100 flex items-center justify-between pointer-events-auto">
                        <div className="flex flex-col gap-1">
                          <Link
                            to={`/products-details/${product.id}`}
                            className="block"
                          >
                            <h3 className="font-black text-(--color-dark) text-[10px] tracking-[0.2em] uppercase truncate hover:opacity-50 transition-opacity">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="font-bold text-(--color-dark) text-sm tracking-tight">
                            {product.price.toLocaleString()} EGP
                          </p>
                        </div>

                        <Link to={`/products-details/${product.id}`}>
                          <div className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all shadow-xl">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Static info for mobile/standard view when not hovered */}
                <div className="mt-6 space-y-1 block md:hidden">
                  <Link to={`/products-details/${product.id}`}>
                    <h3 className="font-bold text-(--color-dark) text-[10px] tracking-[0.2em] uppercase truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-black text-(--color-dark) text-xs">
                    {product.price.toLocaleString()} EGP
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="shrink-0 w-12 md:w-32 lg:w-48" />
        </motion.div>
      )}
    </section>
  );
}
