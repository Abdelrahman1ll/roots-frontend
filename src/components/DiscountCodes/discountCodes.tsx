import { motion } from "framer-motion";
import { Tag, Percent, Calendar, Trash2, Edit, Ticket } from "lucide-react";
import type { DiscountCodeType } from "../../types/DiscountCodeType";
import useDiscountCodes from "./useDiscountCodes";

/**
 * DiscountCodes: Management interface for administrative discount code operations.
 * أكواد الخصم: واجهة إدارة عمليات أكواد الخصم الإدارية.
 */
export default function DiscountCodes() {
  const {
    data,
    isLoading,
    isAdding,
    isEditing,
    isDeleting,
    newCode,
    newDiscount,
    newExpiry,
    handleAddOrSave,
    handleEdit,
    handleDelete,
    reviewFormRef,
    editingId,
    setNewCode,
    setNewDiscount,
    setNewExpiry,
    formatEndDateArabic,
  } = useDiscountCodes();

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
            <Ticket size={14} />
            Commerce Control
          </div>
          <h1 className="text-4xl font-black text-(--color-pakistan) tracking-tight mb-2">
            Discount Codes
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium font-['Outfit']">
            Manage promotional campaigns and special offers
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
            {editingId ? "Edit Promotion" : "New Promotion"}
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-(--color-pakistan)/60 ml-2">
                Coupon Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: SUMMER2026"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
                />
                <Tag
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-pakistan)/40 group-focus-within:text-(--color-tiger) transition-colors"
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-(--color-pakistan)/60 ml-2">
                Discount
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="%"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
                />
                <Percent
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-pakistan)/40 group-focus-within:text-(--color-tiger) transition-colors"
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-(--color-pakistan)/60 ml-2">
                Expires On
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={newExpiry}
                  placeholder="Start Date"
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
                />
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-pakistan)/40 group-focus-within:text-(--color-tiger) transition-colors"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddOrSave}
            disabled={isAdding || isEditing || isDeleting}
            className="w-full py-4 rounded-2xl bg-linear-to-r from-(--color-tiger) to-(--color-earth) text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-(--color-tiger)/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAdding || isEditing ? (
              "Processing..."
            ) : (
              <>
                {editingId ? <Edit size={16} /> : <Ticket size={16} />}
                {editingId ? "Edit Code" : "Add Code"}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* List of Codes */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10 opacity-50">
              Loading promotions...
            </div>
          ) : data?.discountCodes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/20 backdrop-blur-sm rounded-3xl border border-dashed border-white/60"
            >
              <Ticket
                size={60}
                className="mx-auto text-(--color-pakistan)/20 mb-4"
              />
              <p className="text-(--color-pakistan)/40 font-black uppercase tracking-widest text-xs">
                No active campaigns
              </p>
            </motion.div>
          ) : (
            data?.discountCodes.map((item: DiscountCodeType, index: number) => (
              <motion.div
                key={item?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col sm:flex-row items-center justify-between p-2 rounded-3xl bg-white/30 backdrop-blur-md border border-white/60 hover:bg-white/50 hover:shadow-xl transition-all duration-300 gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-(--color-tiger)/10 flex items-center justify-center text-(--color-tiger) border border-(--color-tiger)/20">
                    <p className="text-xl font-black">{item?.discount}%</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-(--color-pakistan) tracking-tight">
                      {item?.code}
                    </h3>
                    <div className="flex items-center gap-2 text-(--color-pakistan)/60 text-xs font-medium mt-1">
                      <Calendar size={12} />
                      <span>Expires: {formatEndDateArabic(item?.EndDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(item)}
                    aria-label="Edit"
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
                    onClick={() => handleDelete(item.id)}
                    aria-label="Delete"
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
