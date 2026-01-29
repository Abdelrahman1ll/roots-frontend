import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { OrderType } from "../../types/OrderType";
import useOrders from "./useOrders";
import { SkeletonList } from "../Skeleton";
import { BRAND_NAME } from "../../BrandText";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Orders: List of user or admin orders showing status and details.
 * الطلبات: قائمة طلبات المستخدم أو الأدمن توضح الحالة والتفاصيل.
 */
export default function Orders() {
  const { orders, isLoading, formatEndDateArabic } = useOrders();

  const getStatusStyles = (order: OrderType) => {
    if (order?.isDelivered)
      return "bg-green-100 text-green-700 border-green-200";

    if (order?.isShipped)
      return "bg-orange-100 text-orange-700 border-orange-200";

    if (order?.isPaid)
      return "bg-emerald-100 text-emerald-700 border-emerald-200";

    if (order?.isConfirmed) return "bg-blue-100 text-blue-700 border-blue-200";

    if (order?.isCanceled) return "bg-red-100 text-red-700 border-red-200";

    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusText = (order: OrderType) => {
    if (order?.isDelivered) return "Delivered";
    if (order?.isShipped) return "Shipped";
    if (order?.isPaid) return "Paid";
    if (order?.isConfirmed) return "Confirmed";
    if (order?.isCanceled) return "Canceled";
    return "Processing";
  };

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-linear-to-b">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tighter uppercase">
            Order Archive
          </h1>
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400">
            Secure Log • {BRAND_NAME} Integrated History
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonList count={4} />
          </div>
        ) : orders?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-gray-100 bg-white"
          >
            <div className="mb-8 text-gray-100 flex justify-center">
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-4">
              Null Registry
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-10">
              No previous transactions detected.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-80 transition-all border border-black"
            >
              Initialize Procurement
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {orders.map((order: OrderType) => (
              <motion.div key={order?.id}>
                <Link to={`/orders/${order?.id}`} className="block group">
                  <div className="bg-white border border-gray-100 p-6 md:p-8 transition-all duration-500 hover:border-black">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="text-black group-hover:scale-110 transition-transform duration-500">
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                              ORDER #{order?.orderNumber}
                            </h3>
                            <span
                              className={`text-[8px] px-3 py-1 border font-black uppercase tracking-widest ${getStatusStyles(
                                order,
                              )}`}
                            >
                              {getStatusText(order)}
                            </span>
                          </div>
                          <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">
                            {order?.items.length}{" "}
                            {order?.items.length === 1 ? "Element" : "Elements"}{" "}
                            • {formatEndDateArabic(order?.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pt-6 md:pt-0 border-t md:border-t-0 border-gray-50">
                        <p className="text-xl font-black text-black tracking-tighter">
                          {order?.totalPrice.toLocaleString()} EGP
                        </p>
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300 group-hover:text-black transition-colors">
                          Access Registry
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
