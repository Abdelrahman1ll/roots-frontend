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
    <div className="min-h-screen bg-(--color-cornsilk) flex flex-col items-center py-12 px-4 md:px-6">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-12 border-b border-(--color-border) pb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Ticket size={20} className="text-(--color-dark)" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-pakistan)">
              Administrative Panel
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-dark) tracking-tight mb-4">
            Discount codes
          </h1>
          <p className="text-(--color-pakistan) font-medium max-w-lg leading-relaxed text-sm">
            Manage promotional campaigns and special offers for your customer
            base.
          </p>
        </motion.div>

        {/* Management Card */}
        <motion.div
          ref={reviewFormRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-(--color-border) p-6 md:p-10 rounded-none shadow-sm mb-12"
        >
          <h2 className="text-xl font-bold text-(--color-dark) mb-8">
            {editingId ? "Edit" : "New"}
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Coupon code
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Ex: SUMMER2026"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                />
                <Tag
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-(--color-dark) transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Discount percentage
              </label>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="%"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                />
                <Percent
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-(--color-dark) transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Expiry date
              </label>
              <div className="relative group">
                <input
                  type="date"
                  placeholder="Ex: 2026-01-31"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                />
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-(--color-dark) transition-colors"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAddOrSave}
            disabled={isAdding || isEditing || isDeleting}
            className="w-full py-4 bg-(--color-dark) text-white font-bold tracking-widest text-[10px] uppercase shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isAdding || isEditing ? (
              "Processing..."
            ) : (
              <>
                {editingId ? <Edit size={14} /> : <Ticket size={14} />}
                {editingId ? "Update Code" : "Add Code"}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* List of Codes */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
              Active campaigns
            </h3>
          </div>

          {isLoading ? (
            <div className="text-center py-20 bg-white border border-(--color-border) rounded-none text-gray-300 text-sm">
              Loading promotions...
            </div>
          ) : data?.discountCodes.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-(--color-border) rounded-none">
              <Ticket size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-(--color-pakistan) text-sm font-medium">
                No active campaigns at this time
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {data?.discountCodes.map(
                (item: DiscountCodeType, index: number) => (
                  <motion.div
                    key={item?.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between p-5 bg-white border border-(--color-border) rounded-none hover:border-(--color-dark) transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-50 flex items-center justify-center text-(--color-dark) border border-gray-100">
                        <p className="text-lg font-bold">{item?.discount}%</p>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-(--color-dark) tracking-tight">
                          {item?.code}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                          <Calendar size={12} />
                          <span>
                            Expires: {formatEndDateArabic(item?.EndDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-(--color-pakistan) hover:text-(--color-dark) transition-colors"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-200 hover:text-red-500 transition-colors"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
