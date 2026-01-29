import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Package,
  Tag,
  Palette,
  DollarSign,
  Type,
  FileText,
  Ruler,
  Layers,
  ChevronDown,
  Check,
  Save,
  Trash2,
  Box,
  Truck,
  Zap,
  Loader2,
} from "lucide-react";
import useProductForm, {
  type ErrorProductType,
  type SizeErrorType,
} from "./useProductForm";

/**
 * ProductForm: Modal/Page for administrative product creation and editing.
 * نموذج المنتج: واجهة إدارية لإنشاء وتعديل بيانات المنتجات.
 */
export default function ProductForm({ mode }: { mode: "add" | "edit" }) {
  const {
    formData,
    errors,
    addSizeField,
    removeSizeField,
    handleSizeChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    handleChange,
    isLoadingPatch,
    isLoadingPost,
    categories,
    isLoadingCategory,
    isErrorCategory,
    nameCategory,
    setNameCategory,
    colors,
    isLoadingColors,
    isErrorColors,
    nameColors,
    setNameColors,
  } = useProductForm(mode);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--color-tiger-10),transparent),radial-gradient(circle_at_bottom_left,var(--color-pakistan-10),transparent)] flex flex-col items-center py-6 px-4 md:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-(--color-pakistan)/5 border border-(--color-pakistan)/10 text-(--color-pakistan) mb-4">
            <Package size={16} className="text-(--color-tiger)" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Product Management
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-(--color-pakistan) tracking-tight mb-4">
            {mode === "add" ? "Create Product" : "Edit Product"}
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium max-w-lg mx-auto leading-relaxed">
            Configure product details, visuals, and inventory specifications
            with precision.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-2xl border border-white/60 p-4 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-(--color-tiger)/10 rounded-xl text-(--color-tiger)">
                  <Type size={20} />
                </div>
                <h3 className="text-xl font-black text-(--color-pakistan) tracking-tight">
                  Identity & Valuation
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    label: "Product Name",
                    name: "name",
                    type: "text",
                    icon: <Package size={18} />,
                  },
                  {
                    label: "Price",
                    name: "price",
                    type: "number",
                    icon: <DollarSign size={18} />,
                  },
                  {
                    label: "Promo Price",
                    name: "promotionalPrice",
                    type: "number",
                    icon: <Tag size={18} />,
                  },
                ].map((input) => (
                  <div
                    key={input.name}
                    className={`space-y-1.5 ${
                      input.name === "name" ? "col-span-2" : "col-span-1"
                    }`}
                  >
                    <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                      {input.label}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-tiger) transition-transform group-focus-within:scale-110">
                        {input.icon}
                      </div>
                      <input
                        type={input.type}
                        name={input.name}
                        min={input.type === "number" ? 0 : undefined}
                        value={
                          formData[input.name as keyof ErrorProductType] as
                            | string
                            | number
                        }
                        placeholder={input.label}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                    {errors[input.name as keyof ErrorProductType] && (
                      <p className="text-red-500 text-[10px] font-bold ml-1">
                        {errors[input.name as keyof ErrorProductType] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Selections - Categories & Colors */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="space-y-1.5 focus-within:z-10">
                  <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <ProductDropdown
                    value={formData.category}
                    label={nameCategory || "Select Category"}
                    items={categories?.categories || []}
                    isLoading={isLoadingCategory}
                    isError={isErrorCategory}
                    icon={<Layers size={18} />}
                    onChange={(id, name) => {
                      handleChange({
                        target: { name: "category", value: id },
                      } as unknown as React.ChangeEvent<HTMLInputElement>);
                      setNameCategory(name);
                    }}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 focus-within:z-10">
                  <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                    Primary Color
                  </label>
                  <ProductDropdown
                    value={formData.colors}
                    label={nameColors || "Select Color"}
                    items={colors?.colors || []}
                    isLoading={isLoadingColors}
                    isError={isErrorColors}
                    icon={<Palette size={18} />}
                    onChange={(id, name) => {
                      handleChange({
                        target: { name: "colors", value: id },
                      } as unknown as React.ChangeEvent<HTMLInputElement>);
                      setNameColors(name);
                    }}
                  />
                  {errors.colors && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">
                      {errors.colors}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 focus-within:z-10">
                <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                  Product Description
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-(--color-tiger)">
                    <FileText size={18} />
                  </div>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the product features and benefits..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm min-h-[120px] resize-none"
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </section>

            {/* Logistics & Inventory */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-(--color-tiger)/10 rounded-xl text-(--color-tiger)">
                  <Box size={20} />
                </div>
                <h3 className="text-xl font-black text-(--color-pakistan) tracking-tight">
                  Inventory & Logistics
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    label: "Total Stock",
                    name: "stock",
                    icon: <Layers size={18} />,
                  },
                  {
                    label: "Wholesale Price",
                    name: "wholesalePrice",
                    icon: <DollarSign size={18} />,
                  },
                ].map((input) => (
                  <div
                    key={input.name}
                    className="space-y-1.5 focus-within:z-10"
                  >
                    <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                      {input.label}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-tiger)">
                        {input.icon}
                      </div>
                      <input
                        type="number"
                        name={input.name}
                        value={
                          formData[input.name as keyof ErrorProductType] as
                            | string
                            | number
                        }
                        placeholder={input.label}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                    {errors[input.name as keyof ErrorProductType] && (
                      <p className="text-red-500 text-[10px] font-bold ml-1">
                        {errors[input.name as keyof ErrorProductType] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Financial Overhead */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-(--color-tiger)/10 rounded-xl text-(--color-tiger)">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-black text-(--color-pakistan) tracking-tight">
                  Expense Monitoring
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    label: "Packaging Cost",
                    name: "packagingCost",
                    icon: <Truck size={18} />,
                  },
                  {
                    label: "Marketing Cost",
                    name: "marketingCosts",
                    icon: <Zap size={18} />,
                  },
                ].map((input) => (
                  <div
                    key={input.name}
                    className="space-y-1.5 focus-within:z-10"
                  >
                    <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                      {input.label}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-tiger)">
                        {input.icon}
                      </div>
                      <input
                        type="number"
                        name={input.name}
                        min="0"
                        value={
                          formData[input.name as keyof ErrorProductType] as
                            | string
                            | number
                        }
                        onChange={handleChange}
                        placeholder={input.label}
                        className="w-full pl-12 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                    {errors[input.name as keyof ErrorProductType] && (
                      <p className="text-red-500 text-[10px] font-bold ml-1">
                        {errors[input.name as keyof ErrorProductType] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Visual Assets */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-(--color-tiger)/10 rounded-xl text-(--color-tiger)">
                  <Palette size={20} />
                </div>
                <h3 className="text-xl font-black text-(--color-pakistan) tracking-tight">
                  Visual Assets
                </h3>
              </div>

              <div className="p-4 bg-white/40 border border-white/60 rounded-4xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-(--color-pakistan) uppercase tracking-wider">
                      Product Gallery
                    </h4>
                    <p className="text-[10px] font-medium text-(--color-pakistan)/40 italic">
                      High-resolution images enhance customer confidence.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 bg-(--color-tiger) text-white px-5 py-2.5 rounded-xl cursor-pointer hover:bg-(--color-earth) transition-all shadow-lg shadow-(--color-tiger)/20 font-black text-[10px] uppercase tracking-widest group">
                    <PlusCircle
                      size={14}
                      className="group-hover:rotate-90 transition-transform"
                    />
                    Upload Photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {errors?.viewPhotos && errors?.viewPhotos.length > 0 && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">
                    {errors?.viewPhotos[0]}
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {formData?.viewPhotos.map((src, index) => (
                      <motion.div
                        key={src + index}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group aspect-square border border-white/60 rounded-2xl overflow-hidden shadow-sm bg-white"
                      >
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-md text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                        >
                          <Trash2 size={12} strokeWidth={3} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Dimensional Scaling */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-(--color-tiger)/10 rounded-xl text-(--color-tiger)">
                  <Ruler size={20} />
                </div>
                <h3 className="text-xl font-black text-(--color-pakistan) tracking-tight">
                  Size Variations
                </h3>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {formData?.sizes.map((size, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-2 md:grid-cols-5 gap-3 p-2 bg-white/30 border border-white/40 rounded-2xl items-end relative group "
                    >
                      {["size", "length", "width", "stock"].map((field) => (
                        <div key={field} className="space-y-1.5">
                          <label className="text-[10px] font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                            {field}
                          </label>
                          <input
                            type={field === "size" ? "text" : "number"}
                            min={field !== "size" ? 0 : undefined}
                            value={
                              size[field as keyof SizeErrorType] as
                                | string
                                | number
                            }
                            placeholder={field}
                            onChange={(e) =>
                              handleSizeChange(
                                index,
                                field as keyof SizeErrorType,
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-sm text-(--color-pakistan) shadow-sm"
                          />
                          {errors?.sizes?.[index]?.[
                            field as keyof SizeErrorType
                          ] && (
                            <p className="text-red-500 text-[9px] font-bold ml-1">
                              {
                                errors?.sizes[index][
                                  field as keyof SizeErrorType
                                ]
                              }
                            </p>
                          )}
                        </div>
                      ))}
                      <div className="md:col-span-1 col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeSizeField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={addSizeField}
                  className="flex items-center gap-2 text-xs font-black text-(--color-tiger) uppercase tracking-widest hover:text-(--color-earth) transition-colors ml-1"
                >
                  <PlusCircle size={14} />
                  Add New Size Specification
                </button>
              </div>
            </section>

            {/* Submit Action Block */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                whileHover={
                  !(isLoadingPost || isLoadingPatch)
                    ? {
                        scale: 1.01,
                        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
                      }
                    : {}
                }
                whileTap={
                  !(isLoadingPost || isLoadingPatch) ? { scale: 0.98 } : {}
                }
                disabled={isLoadingPost || isLoadingPatch}
                type="submit"
                className={`w-full flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl shadow-xl transition-all relative overflow-hidden group
                 ${
                   isLoadingPost || isLoadingPatch
                     ? "bg-(--color-earth) cursor-not-allowed"
                     : "bg-linear-to-r from-(--color-tiger) to-(--color-earth) hover:opacity-90 cursor-pointer"
                 }`}
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {isLoadingPost || isLoadingPatch ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    {mode === "add"
                      ? "Finalize & Save Product"
                      : "Confirm Data Updates"}
                  </>
                )}
              </motion.button>

              <p className="text-center mt-6 text-[10px] font-bold text-(--color-pakistan)/30 uppercase tracking-[0.3em]">
                Authentic Administrative Operation
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * ProductDropdown: Custom dropdown for category and color selection.
 */
const ProductDropdown = ({
  value,
  label,
  items,
  isLoading,
  isError,
  icon,
  onChange,
}: {
  value: string;
  label: string;
  items: { id: string; name: string }[];
  isLoading: boolean;
  isError: boolean;
  icon: React.ReactNode;
  onChange: (id: string, name: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pl-4 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="text-(--color-tiger)">{icon}</div>
          <span className="truncate max-w-[120px] sm:max-w-none">{label}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-(--color-tiger) transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl p-2 overflow-hidden"
            >
              {isLoading ? (
                <div className="p-4 text-center text-(--color-pakistan)/40 text-xs font-black uppercase">
                  Fetching data...
                </div>
              ) : isError ? (
                <div className="p-4 text-center text-red-500 text-xs font-black uppercase">
                  Retrieval Error
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1 space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.id, item.name);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                        value === item.id
                          ? "bg-(--color-tiger) text-white shadow-md shadow-(--color-tiger)/20"
                          : "hover:bg-white text-(--color-pakistan)/80"
                      }`}
                    >
                      <span className="font-black text-sm">{item.name}</span>
                      {value === item.id && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white/20 p-1 rounded-full text-white"
                        >
                          <Check size={14} strokeWidth={4} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
