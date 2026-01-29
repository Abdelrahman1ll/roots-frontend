import type { OrderEmail } from "../../types/OrderEmailType";
import useEmailOrderDispatcher from "./useEmailOrderDispatcher";
import { User, Mail, ArrowRight, Edit, Trash2, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function EmailOrderDispatcher() {
  const {
    data,
    isLoading,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    errors,
    handleSendEmail,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    reviewFormRef,
    formatEndDateArabic,
    editingId,
  } = useEmailOrderDispatcher();

  return (
    <div className="relative min-h-screen py-10 px-4">
      {/* Dynamic Radial Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(188,108,37,0.1)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(96,108,56,0.05)_0%,transparent_50%)]" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-(--color-tiger) font-black text-xs uppercase tracking-widest mb-4">
            <Truck size={14} />
            Delivery Dispatch
          </div>
          <h1 className="text-4xl font-black text-(--color-pakistan) tracking-tight mb-2">
            Order Routing
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium font-['Outfit']">
            Configure automated order forwarding to logistics partners
          </p>
        </motion.div>

        {/* Management Card */}
        <motion.div
          ref={reviewFormRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl p-4 sm:p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-(--color-pakistan) mb-6">
            {editingId ? "Edit Dispatch Rule" : "New Dispatch Rule"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-(--color-pakistan)/60 ml-2">
                Logistics Partner Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Aramex Express"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
                />
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-pakistan)/40 group-focus-within:text-(--color-tiger) transition-colors"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs ml-2 font-bold">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-(--color-pakistan)/60 ml-2">
                Forwarding Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="orders@logistics.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
                />
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-pakistan)/40 group-focus-within:text-(--color-tiger) transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs ml-2 font-bold">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={editingId ? handleSaveEdit : handleSendEmail}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-linear-to-r from-(--color-tiger) to-(--color-earth) text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-(--color-tiger)/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                {editingId ? "Update Configuration" : "Add Routing Rule"}
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* List of Dispatchers */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10 opacity-50">
              Loading dispatchers...
            </div>
          ) : data?.dispatchers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/20 backdrop-blur-sm rounded-3xl border border-dashed border-white/60"
            >
              <Truck
                size={60}
                className="mx-auto text-(--color-pakistan)/20 mb-4"
              />
              <p className="text-(--color-pakistan)/40 font-black uppercase tracking-widest text-xs">
                No active dispatch rules
              </p>
            </motion.div>
          ) : (
            data?.dispatchers.map((order: OrderEmail, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col sm:flex-row items-center justify-between p-2 md:p-4 rounded-3xl bg-white/30 backdrop-blur-md border border-white/60 hover:bg-white/50 hover:shadow-xl transition-all duration-300 gap-4"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-(--color-tiger)/10 flex items-center justify-center text-(--color-tiger) border border-(--color-tiger)/20 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-(--color-pakistan) tracking-tight truncate">
                      {order?.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-(--color-pakistan)/60 text-sm font-medium mt-1">
                      <div className="flex items-center gap-1">
                        <Mail size={12} className="shrink-0" />
                        <span className="truncate">{order?.email}</span>
                      </div>
                      {order?.dispatchedAt && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-1 h-1 bg-(--color-pakistan)/40 rounded-full hidden sm:block" />
                          <span>
                            {formatEndDateArabic(order?.dispatchedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-white/20 pt-3 sm:pt-0">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(order)}
                    aria-label={`Edit ${order.name}`}
                    className="p-3 rounded-xl bg-white/40 border border-white/60 text-(--color-pakistan) hover:text-(--color-tiger) transition-colors"
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(order?.id)}
                    aria-label={`Delete ${order.name}`}
                    className="p-3 rounded-xl bg-white/40 border border-white/60 text-red-500/60 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
