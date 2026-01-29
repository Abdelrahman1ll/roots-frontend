import { motion } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import type { CartItemType } from "../../types/CartType";
import UseCart from "./useCart";

/**
 * Cart: Shopping cart interface for viewing, adjusting, and proceeding to checkout.
 * السلة: واجهة سلة التسوق لعرض وتعديل المنتجات والمتابعة لإتمام الطلب.
 */
export default function Cart() {
  const {
    data,
    isLoading,
    isError,
    decreaseQuantity,
    increaseQuantity,
    removeItem,
    navigate,
  } = UseCart();
  return (
    <div className="p-6 md:p-10 mt-10 max-w-6xl mx-auto min-h-[80vh]">
      <div className="mb-20 space-y-4">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-(--color-dark)/40 block">
          Archival Selection
        </span>
        <h2 className="text-4xl md:text-7xl font-light tracking-tighter text-(--color-dark) uppercase">
          Shopping <span className="font-black">Bag</span>
        </h2>
        <div className="w-16 h-px bg-gray-100" />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-10">
          {[1, 2].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-center md:items-start gap-8 p-0 animate-pulse border-b border-gray-50 pb-10"
            >
              <div className="w-48 h-64 bg-gray-50" />
              <div className="flex-1 flex flex-col gap-4 w-full">
                <div className="flex justify-between items-start">
                  <div className="h-8 bg-gray-50 w-1/3"></div>
                  <div className="w-10 h-10 bg-gray-50"></div>
                </div>
                <div className="h-10 bg-gray-50 w-1/4 mt-4"></div>
                <div className="mt-8 h-4 bg-gray-50 w-full" />
              </div>
            </div>
          ))}
          <div className="mt-10 w-full h-16 bg-gray-50 animate-pulse"></div>
        </div>
      ) : isError || !data?.carts?.items?.length ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-20 text-center border border-gray-100"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gray-50 mx-auto flex items-center justify-center text-black mb-10"
          >
            <ShoppingCart size={32} strokeWidth={1.5} />
          </motion.div>

          <h3 className="text-2xl font-black text-(--color-dark) mb-6 tracking-widest uppercase">
            {isError ? "System Protocol Error" : "Archive Empty"}
          </h3>

          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] max-w-xs mx-auto mb-12 leading-relaxed">
            {isError
              ? "We encountered a synchronization error. Please re-initiate the session."
              : "Your current selection is empty. Explore the latest drops to build your archive."}
          </p>

          <motion.button
            whileHover={{ backgroundColor: "#000" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-4 px-12 py-5 bg-(--color-dark) text-white font-black uppercase tracking-[0.4em] text-[10px] transition-all"
          >
            Explore Collection
            <span>→</span>
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-12">
          {data?.carts?.items.map((item: CartItemType) => {
            const percentstock = Math.min(
              (item?.product?.stock / item?.product?.total_stock) * 100,
              100,
            );

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row items-center md:items-start gap-10 p-0 border-b border-gray-100 pb-12 last:border-none"
              >
                <img
                  src={item?.product?.images[0]}
                  alt={item?.product?.name}
                  loading="lazy"
                  className="w-48 h-64 object-cover md:self-center bg-gray-50"
                  srcSet={`
                    ${item?.product?.images[0]}?w=200 200w,
                    ${item?.product?.images[0]}?w=400 400w,
                    ${item?.product?.images[0]}?w=800 800w
                  `}
                  sizes="(max-width: 640px) 200px, 400px"
                />

                <div className="flex-1 flex flex-col gap-4 w-full">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl md:text-3xl font-black text-(--color-dark) uppercase tracking-tighter">
                      {item?.product?.name}
                    </h3>
                    <motion.button
                      whileHover={{ backgroundColor: "#000", color: "#fff" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item?.id)}
                      className="w-12 h-12 flex items-center justify-center border border-gray-100 transition-all text-gray-300 hover:border-black"
                    >
                      <X size={24} strokeWidth={2} />
                    </motion.button>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-light text-(--color-dark)">
                      {item?.product?.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">
                      EGP
                    </span>
                  </div>

                  <div className="mt-6 w-full max-w-sm">
                    <div className="flex justify-between mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">
                      <span>Inventory Status</span>
                      <span>{Math.round(percentstock)}%</span>
                    </div>

                    <div className="w-full h-1 bg-gray-50 overflow-hidden">
                      <motion.div
                        className="h-full bg-black shadow-none"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentstock}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 gap-6">
                    <div className="py-2 border-b border-gray-100 w-fit sm:min-w-[120px]">
                      <p className="text-[11px] font-black text-(--color-dark) uppercase tracking-widest">
                        Size:{" "}
                        <span className="text-gray-400">
                          {item?.sizes?.size}
                        </span>
                        {item?.sizes?.width > 0 && item?.sizes?.length > 0 && (
                          <span className="ml-3 text-[12px] text-gray-400/60 lowercase tracking-widest font-medium">
                            (W:{item.sizes.width} H:{item.sizes.length}cm)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 border border-gray-100 p-1 w-fit">
                      <button
                        disabled={item?.quantity <= 1}
                        onClick={() =>
                          decreaseQuantity({
                            id: item?.id,
                            quantity: item?.quantity,
                          })
                        }
                        className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-black hover:bg-gray-50 transition-all disabled:opacity-20 text-xl font-light"
                      >
                        −
                      </button>
                      <span className="text-base font-black text-(--color-dark) min-w-[24px] text-center">
                        {item?.quantity}
                      </span>
                      <button
                        disabled={item?.quantity >= item?.product?.stock}
                        onClick={() =>
                          increaseQuantity({
                            id: item?.id,
                            quantity: item?.quantity,
                          })
                        }
                        className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-black hover:bg-gray-50 transition-all disabled:opacity-20 text-xl font-light"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col items-end gap-8">
            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">
                Total Protocol Weight
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-black text-(--color-dark)">
                  {data?.carts?.totalPrice?.toLocaleString()}
                </span>
                <span className="text-xs font-black uppercase text-gray-300 tracking-[0.2em]">
                  EGP
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ backgroundColor: "#000" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/checkout")}
              className="w-full md:w-[400px] py-6 text-white text-xs bg-(--color-dark) font-black uppercase tracking-[0.5em] transition-all"
            >
              Initiate Checkout
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
