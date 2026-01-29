import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { useUI } from "../../context/UIContext";
import UseCart from "./useCart";
import type { CartItemType } from "../../types/CartType";

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUI();
  const {
    data,
    isLoading,
    isError,
    decreaseQuantity,
    increaseQuantity,
    removeItem,
    navigate,
  } = UseCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-101 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-(--color-dark)" />
                <h2 className="text-xl font-black uppercase tracking-widest text-(--color-dark)">
                  Archive <span className="font-light">Bag</span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-50 rounded-none transition-colors border border-transparent hover:border-gray-100"
              >
                <X size={24} className="text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-24 h-32 bg-gray-100" />
                      <div className="flex-1 space-y-3 py-2">
                        <div className="h-4 bg-gray-100 w-3/4" />
                        <div className="h-3 bg-gray-100 w-1/2" />
                        <div className="h-8 bg-gray-100 w-24 mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError || !data?.carts?.items?.length ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
                    <ShoppingCart size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-(--color-dark) mb-2">
                    Bag is empty
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8">
                    Your collection is currently empty
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate("/products");
                    }}
                    className="px-8 py-4 bg-(--color-dark) text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-black"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {data?.carts?.items.map((item: CartItemType) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-32 shrink-0 bg-gray-50 overflow-hidden">
                        <img
                          src={item?.product?.images[0]}
                          alt={item?.product?.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-black uppercase tracking-wider text-(--color-dark) line-clamp-1">
                            {item?.product?.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item?.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                          Size: {item?.sizes?.size}
                          {item?.sizes?.width > 0 &&
                            item?.sizes?.length > 0 && (
                              <span className="ml-2 text-[9px] text-gray-400/70 lowercase">
                                (w:{item.sizes.width} h:{item.sizes.length}cm)
                              </span>
                            )}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-gray-100 p-0.5">
                            <button
                              disabled={item?.quantity <= 1}
                              onClick={() =>
                                decreaseQuantity({
                                  id: item?.id,
                                  quantity: item?.quantity,
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-20 transition-all font-light"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-[11px] font-black text-(--color-dark)">
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
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-20 transition-all font-light"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-black text-(--color-dark)">
                            {item?.product?.price.toLocaleString()}{" "}
                            <span className="text-[9px] text-gray-300 font-bold uppercase ml-1">
                              EGP
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {data?.carts?.items?.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                    Total Volume
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-(--color-dark)">
                      {data?.carts?.totalPrice?.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black text-gray-300 uppercase">
                      EGP
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-5 bg-(--color-dark) text-white text-[11px] font-black uppercase tracking-[0.5em] transition-all hover:bg-black shadow-lg"
                >
                  Initiate Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
