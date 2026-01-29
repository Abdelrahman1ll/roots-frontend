import { motion } from "framer-motion";
import { useGetProductsQuery } from "../../redux/products/apiProducts";
import type { ProductType } from "../../types/ProductType";
import { Link } from "react-router-dom";
import { getCloudinaryUrl, getCloudinarySrcSet } from "../../utils/cloudinary";
import { PackageSearch } from "lucide-react";

/**
 * RelatedProducts: A static vertical grid of products to replace the horizontal slider.
 */
export default function RelatedProducts() {
  const { data: products, isLoading } = useGetProductsQuery("/products");

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-3/4 bg-gray-50 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  const list = products?.products?.slice(0, 4) || [];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10 border-t border-(--color-border)">
      <div className="mb-12 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-4">
          Complete the Look
        </span>
        <h2 className="text-3xl font-black text-(--color-dark) tracking-tight uppercase">
          Related Products
        </h2>
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((product: ProductType) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group/item"
            >
              <Link
                to={`/products-details/${product.id}`}
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="relative aspect-3/4 overflow-hidden bg-gray-50 mb-6">
                  <img
                    src={getCloudinaryUrl(product.images[0], { width: 600 })}
                    srcSet={getCloudinarySrcSet(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-0 bg-black text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest">
                      -{product.discountPercentage.toFixed(0)}%
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-(--color-dark) mb-1 group-hover:opacity-60 transition-opacity">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-bold text-(--color-dark)">
                      EGP {product.price.toLocaleString()}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        EGP {product.promotionalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 opacity-30">
          <PackageSearch size={40} className="mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest">
            No products found
          </p>
        </div>
      )}
    </section>
  );
}
