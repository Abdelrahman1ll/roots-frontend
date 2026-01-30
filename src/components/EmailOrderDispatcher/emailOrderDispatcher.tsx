import type { OrderEmail } from "../../types/OrderEmailType";
import useEmailOrderDispatcher from "./useEmailOrderDispatcher";
import { Mail, ArrowRight, Edit, Trash2, Truck } from "lucide-react";
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
    <div className="relative min-h-screen py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Truck size={18} className="text-black" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/70">
              Delivery Dispatch
            </span>
          </div>
          <h1 className="text-5xl font-light text-black tracking-tight mb-4">
            Order routing
          </h1>
          <p className="text-black/70 text-base max-w-lg leading-relaxed">
            Configure automated order forwarding to logistics partners. Manage
            your delivery network efficiently.
          </p>
        </motion.div>

        {/* Management Card */}
        <motion.div
          ref={reviewFormRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-black/10 p-8 md:p-12 mb-12 shadow-sm"
        >
          <h2 className="text-2xl font-light text-black mb-10">
            {editingId ? "Edit dispatch rule" : "New dispatch rule"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <label className="text-sm font-bold text-black uppercase tracking-wider">
                Logistics partner name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Aramex Express"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-0 py-4 border-b-2 border-black/10 focus:border-black outline-none transition-all text-xl text-black placeholder:text-black/30 bg-transparent font-medium"
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-xs font-black uppercase tracking-widest mt-2">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-black uppercase tracking-wider">
                Forwarding email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="orders@logistics.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-0 py-4 border-b-2 border-black/10 focus:border-black outline-none transition-all text-xl text-black placeholder:text-black/30 bg-transparent font-medium"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs font-black uppercase tracking-widest mt-2">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={editingId ? handleSaveEdit : handleSendEmail}
              disabled={isLoading}
              className="px-12 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 disabled:opacity-30"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  {editingId ? "Update configuration" : "Add routing rule"}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* List of Dispatchers */}
        <div className="space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black px-4 py-2 border-l-2 border-black">
            Active dispatchers
          </h3>

          {isLoading ? (
            <div className="text-center py-24 text-black font-bold text-sm tracking-[0.2em] uppercase">
              Loading dispatchers...
            </div>
          ) : data?.dispatchers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 border-2 border-dashed border-black/5 bg-neutral-50"
            >
              <Truck size={48} className="mx-auto text-black/10 mb-8" />
              <p className="text-black/40 font-bold text-sm uppercase tracking-widest">
                No active dispatch rules found
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {data?.dispatchers.map((order: OrderEmail, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col sm:flex-row items-center justify-between p-8 bg-white border border-black/5 hover:border-black/20 hover:shadow-md transition-all duration-300 gap-8"
                >
                  <div className="flex items-center gap-10 w-full">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-light text-black tracking-tight mb-3">
                        {order?.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 text-black/60 text-sm font-bold tracking-wide">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-black" />
                          <span className="text-black">{order?.email}</span>
                        </div>
                        {order?.dispatchedAt && (
                          <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-black" />
                            <span className="text-black">
                              {formatEndDateArabic(order?.dispatchedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6 w-full sm:w-auto justify-end border-t sm:border-t-0 border-black/5 pt-6 sm:pt-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(order)}
                      className="p-3 text-black/40 hover:text-black transition-colors bg-neutral-50 rounded-none border border-black/5 hover:border-black"
                    >
                      <Edit size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(order?.id)}
                      className="p-3 text-black/40 hover:text-red-600 transition-colors bg-neutral-50 rounded-none border border-black/5 hover:border-red-600"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
