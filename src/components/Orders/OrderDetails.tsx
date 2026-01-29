import { motion } from "framer-motion";
import {
  Truck,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Package,
} from "lucide-react";

import OrderProgress from "./OrderProgress";
import useOrderDetails from "./useOrderDetails";
import { SkeletonList } from "../Skeleton";

interface OrderItemType {
  id: number;
  product: {
    name: string;
    images: string[];
    discountPercentage?: number;
    price: number;
  };
  quantity: number;
  sizes: {
    size: string;
    length: number;
    width: number;
  };
  price: number;
}

/**
 * OrderDetails: Comprehensive view of a single order, including items, shipping, and status history.
 * تفاصيل الطلب: عرض شامل لطلب واحد، بما في ذلك العناصر، الشحن، وسجل الحالة.
 */
export default function OrderDetails() {
  const {
    order,
    specialSteps,
    actualIndex,
    refetchOrders,
    role,
    isLoadingOrders,
  } = useOrderDetails();

  const paymentMethod =
    order?.paymentMethod === "credit_card"
      ? "Credit Card"
      : order?.paymentMethod === "cash_on_delivery"
        ? "Cash on Delivery"
        : order?.paymentMethod === "vodafone_cash"
          ? "Vodafone Cash"
          : order?.paymentMethod === "instaPay"
            ? "InstaPay"
            : order?.paymentMethod === "paypal"
              ? "PayPal"
              : "Payment";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="flex justify-center mt-20 mb-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-black tracking-tighter uppercase text-black"
        >
          Archive Registry
        </motion.h2>
      </div>

      <div className="min-h-screen flex justify-center items-start pb-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-none border border-gray-100 w-full max-w-5xl p-6 md:p-12 transition-all duration-500"
        >
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {order?.isPaid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200"
              >
                <CheckCircle2 size={12} /> Paid Protocol
              </motion.div>
            )}
            {order?.isCanceled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200"
              >
                <XCircle size={12} /> Canceled Archive
              </motion.div>
            )}
          </div>

          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-50 pb-10"
          >
            <div className="flex items-center gap-6">
              <div className="text-black">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tighter">
                  {paymentMethod} Protocol
                </h2>
                {role !== "user" && order?.paymentId && (
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mt-2">
                    TX: {order.paymentId}
                  </p>
                )}
              </div>
            </div>
            <div className="inline-flex items-center px-4 py-2 border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                ID: {order?.orderNumber}
              </span>
            </div>
          </motion.div>

          {/* Customer + Order Info */}
          {role !== "user" && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
            >
              {/* Customer Info */}
              <div className="group rounded-none p-6 border border-gray-100 bg-gray-50/50 transition-all duration-300">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
                  <User size={12} />
                  Customer Index
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-300">
                      <User size={12} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Identity
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black">
                        {order?.user?.firstName || "N/A"}{" "}
                        {order?.user.lastName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-gray-300">
                      <Mail size={12} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Endpoint
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black">
                        {order?.user.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-gray-300">
                      <Phone size={12} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Signal
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black">
                        {order?.user.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="group rounded-none p-6 border border-gray-100 bg-gray-50/50 transition-all duration-300">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
                  <MapPin size={12} />
                  Dispatch Node
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-300">
                      <MapPin size={12} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Location
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black">
                        {order?.addresses.city}, {order?.addresses.country}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-1">
                        {order?.addresses.address || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-gray-300">
                      <Phone size={12} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Contact
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black">
                        {order?.addresses.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Items */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8 flex items-center gap-3">
              <Package size={12} />
              Archive Elements
            </h3>

            <div className="space-y-6">
              {isLoadingOrders ? (
                <SkeletonList count={3} />
              ) : !order || order?.items?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-20 bg-gray-50 border border-gray-100"
                >
                  <div className="mb-6 text-gray-100">
                    <ShoppingCart size={48} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                    Null Archive
                  </p>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {order?.items?.map((item: OrderItemType) => (
                    <motion.div
                      key={item.id}
                      className="group flex gap-6 p-4 bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all duration-300"
                    >
                      <div className="relative w-24 h-32 shrink-0 overflow-hidden bg-white">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[10px] font-black text-black uppercase tracking-widest">
                              {item.product.name}
                            </h4>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                              QTY: {item?.quantity}
                            </span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            DIM: {item?.sizes?.size} • {item?.sizes.length}X
                            {item?.sizes.width}CM
                          </p>
                        </div>
                        <p className="text-xs font-black text-black">
                          {item.product.price.toLocaleString()} EGP
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          {/* Delivery & Total */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-8 mb-8 border-t border-(--color-tiger)/10 pt-8"
          >
            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black flex items-center gap-3">
                <Truck size={12} />
                Dispatch Protocol
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-6 border border-gray-100 flex items-center gap-4 bg-gray-50/50">
                  <div className="text-black">
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                      Method
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black">
                      Home Dispatch
                    </p>
                  </div>
                </div>
                <div className="p-6 border border-gray-100 flex items-center gap-4 bg-gray-50/50">
                  <div className="text-black">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                      Timeline
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black">
                      3-7 Production Cycles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-2 border-black text-black w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-gray-400">
                Final Aggregate
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Base Value</span>
                  <span>
                    {(
                      (order?.totalPrice ?? 0) - (order?.deliveryPrice ?? 0)
                    ).toLocaleString()}{" "}
                    EGP
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Dispatch Fee</span>
                  <span>
                    {(order?.deliveryPrice ?? 0).toLocaleString()} EGP
                  </span>
                </div>
                <div className="h-px bg-gray-100 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Total Registered
                  </span>
                  <span className="text-2xl font-black tracking-tighter">
                    {(order?.totalPrice ?? 0).toLocaleString()} EGP
                  </span>
                </div>
              </div>

              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-200 text-center">
                ROOTS ARCHIVE SYSTEM • SECURE GATEWAY
              </p>
            </div>
          </motion.div>

          {/* Order Progress */}
          <motion.div
            variants={itemVariants}
            className="mt-4 border-t border-(--color-tiger)/10 pt-10"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-16 flex items-center justify-center gap-3">
              <Truck size={12} />
              Protocol Timeline
            </h3>

            <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto px-4 mb-20">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -translate-y-1/2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      actualIndex === -1
                        ? "0%"
                        : `${((actualIndex + 1) / specialSteps.length) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className="h-px bg-black"
                ></motion.div>
              </div>

              {/* Steps */}
              {specialSteps.map((step) => {
                const Icon = step.icon;
                const active = order?.[step.key] === true;

                return (
                  <div
                    key={step.label}
                    className="relative z-10 flex flex-col items-center group"
                  >
                    <motion.div
                      className={`w-10 h-10 flex items-center justify-center rounded-none border transition-all duration-500 ${
                        active
                          ? step.key === "isCanceled"
                            ? "bg-red-100 border-red-200 text-red-700"
                            : step.key === "isPaid"
                              ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                              : step.key === "isConfirmed"
                                ? "bg-blue-100 border-blue-200 text-blue-700"
                                : step.key === "isShipped"
                                  ? "bg-orange-100 border-orange-200 text-orange-700"
                                  : "bg-green-100 border-green-200 text-green-700"
                          : "bg-white border-gray-100 text-gray-200"
                      }`}
                    >
                      <Icon size={14} />
                    </motion.div>

                    <div className="absolute -bottom-10 w-24 text-center">
                      <p
                        className={`text-[8px] font-black uppercase tracking-widest ${
                          active ? "text-black" : "text-gray-200"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {role !== "user" && order && (
            <OrderProgress order={order} refetch={refetchOrders} />
          )}
        </motion.div>
      </div>
    </>
  );
}
