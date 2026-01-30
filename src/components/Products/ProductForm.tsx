import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronDown,
  Check,
  Save,
  Trash2,
  Loader2,
  PlusCircle,
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
    setNameCategory,
    colors,
    isLoadingColors,
    isErrorColors,
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
    <div className="min-h-screen bg-(--color-cornsilk) flex flex-col items-center py-12 px-4 md:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-left mb-12 border-b border-(--color-border) pb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Package size={20} className="text-(--color-dark)" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-pakistan)">
              Administrative Panel
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-dark) tracking-tight mb-4">
            {mode === "add" ? "New product" : "Edit product"}
          </h1>
          <p className="text-(--color-pakistan) font-medium max-w-lg leading-relaxed text-sm">
            Specify the core attributes and visual assets for this catalog item.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-(--color-border) p-6 md:p-12 rounded-none shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
                  Personal details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    label: "Product name",
                    name: "name",
                    type: "text",
                  },
                  {
                    label: "Price",
                    name: "price",
                    type: "number",
                  },
                  {
                    label: "Promo price",
                    name: "promotionalPrice",
                    type: "number",
                  },
                ].map((input) => (
                  <div
                    key={input.name}
                    className={`space-y-1.5 ${
                      input.name === "name" ? "col-span-2" : "col-span-1"
                    }`}
                  >
                    <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                      {input.label}
                    </label>
                    <div className="relative group">
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
                        className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                      />
                    </div>
                    {errors[input.name as keyof ErrorProductType] && (
                      <p className="text-red-500 text-[10px] font-medium mt-1">
                        {errors[input.name as keyof ErrorProductType] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Selections - Categories & Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                      Category
                    </label>
                  </div>
                  <ProductDropdown
                    value={formData.category}
                    label="Select Category"
                    items={categories?.categories || []}
                    isLoading={isLoadingCategory}
                    isError={isErrorCategory}
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

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                      Primary color
                    </label>
                  </div>
                  <ProductDropdown
                    value={formData.colors}
                    label="Select Color"
                    items={colors?.colors || []}
                    isLoading={isLoadingColors}
                    isError={isErrorColors}
                    showSwatches={true}
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                  Description
                </label>
                <div className="relative group">
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the product..."
                    className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm min-h-[120px] resize-none"
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
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
                  Inventory & logistics
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    label: "Total stock",
                    name: "stock",
                  },
                  {
                    label: "Wholesale price",
                    name: "wholesalePrice",
                  },
                ].map((input) => (
                  <div key={input.name} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-(--color-pakistan) uppercase tracking-widest">
                      {input.label}
                    </label>
                    <div className="relative group">
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
                        className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                      />
                    </div>
                    {errors[input.name as keyof ErrorProductType] && (
                      <p className="text-red-500 text-[10px] font-medium mt-1">
                        {errors[input.name as keyof ErrorProductType] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Financial Overhead */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
                  Cost management
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    label: "Packaging cost",
                    name: "packagingCost",
                  },
                  {
                    label: "Marketing cost",
                    name: "marketingCosts",
                  },
                ].map((input) => (
                  <div key={input.name} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-(--color-pakistan) uppercase tracking-widest">
                      {input.label}
                    </label>
                    <div className="relative group">
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
                        className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                      />
                    </div>
                    {errors[input.name as keyof ErrorProductType] && (
                      <p className="text-red-500 text-[10px] font-medium mt-1">
                        {errors[input.name as keyof ErrorProductType] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Visual Assets */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
                  Visual assets
                </h3>
              </div>

              <div className="p-6 bg-white border border-(--color-border) rounded-none space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-(--color-dark) tracking-widest">
                      Product gallery
                    </h4>
                    <p className="text-[10px] font-medium text-(--color-pakistan) italic">
                      High-resolution images enhance customer confidence.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 bg-(--color-dark) text-white px-6 py-3 rounded-none cursor-pointer hover:bg-black transition-all font-bold text-[10px] tracking-widest group">
                    <PlusCircle size={14} />
                    Upload photos
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
                        className="relative group aspect-square border border-(--color-border) rounded-none overflow-hidden bg-white"
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
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
                  Inventory variations
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
                      className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-white border border-(--color-border) rounded-none items-end relative group"
                    >
                      {["size", "length", "width", "stock"].map((field) => (
                        <div key={field} className="space-y-1.5">
                          <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
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
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-xs text-(--color-dark)"
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
                  className="flex items-center gap-2 text-[10px] font-bold text-(--color-dark) tracking-widest hover:underline transition-all"
                >
                  <PlusCircle size={14} />
                  Add specification
                </button>
              </div>
            </section>

            {/* Submit Action Block */}
            <motion.div variants={itemVariants} className="pt-8">
              <motion.button
                whileHover={
                  !(isLoadingPost || isLoadingPatch)
                    ? {
                        opacity: 0.9,
                      }
                    : {}
                }
                whileTap={
                  !(isLoadingPost || isLoadingPatch) ? { scale: 0.99 } : {}
                }
                disabled={isLoadingPost || isLoadingPatch}
                type="submit"
                className={`w-full flex items-center justify-center gap-3 text-white font-bold tracking-[0.2em] text-[10px] py-5 rounded-none shadow-sm transition-all relative overflow-hidden group
                 ${
                   isLoadingPost || isLoadingPatch
                     ? "bg-(--color-pakistan) cursor-not-allowed"
                     : "bg-(--color-dark) cursor-pointer"
                 }`}
              >
                {isLoadingPost || isLoadingPatch ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    {mode === "add" ? "Create product entry" : "Save changes"}
                  </>
                )}
              </motion.button>

              <p className="text-center mt-8 text-[9px] font-bold text-(--color-pakistan) tracking-[0.3em]">
                Secure inventory operation
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * ProductDropdown: Custom searchable dropdown for category and color selection.
 */
const ProductDropdown = ({
  value,
  label,
  items,
  isLoading,
  isError,
  onChange,
  showSwatches = false,
}: {
  value: string;
  label: string;
  items: { id: string; name: string; color?: string }[];
  isLoading: boolean;
  isError: boolean;
  onChange: (id: string, name: string) => void;
  showSwatches?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedItem = items.find((item) => item.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) text-sm shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          {showSwatches && selectedItem?.color && (
            <div
              className="w-3 h-3 rounded-full border border-gray-200 shrink-0"
              style={{ backgroundColor: selectedItem.color }}
            />
          )}
          <span className="truncate max-w-[120px] sm:max-w-none">
            {selectedItem?.name || label}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-(--color-dark) transition-transform ${
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
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-(--color-border) rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest bg-gray-50 border-none focus:ring-0 placeholder:text-gray-300"
                  autoFocus
                />
              </div>

              {isLoading ? (
                <div className="p-4 text-center text-(--color-pakistan) text-[10px] font-bold uppercase">
                  Loading...
                </div>
              ) : isError ? (
                <div className="p-4 text-center text-red-500 text-[10px] font-bold uppercase">
                  Error
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto scrollbar-hide p-1">
                  {filteredItems.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      No results found
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onChange(item.id, item.name);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-none transition-all text-left group ${
                          value === item.id
                            ? "bg-(--color-dark) text-white"
                            : "hover:bg-gray-50 text-(--color-dark)"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {showSwatches && item.color && (
                            <div
                              className={`w-4 h-4 rounded-full border ${
                                value === item.id
                                  ? "border-white/30"
                                  : "border-gray-200"
                              }`}
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                          <span className="font-bold text-[11px] uppercase tracking-wide">
                            {item.name}
                          </span>
                        </div>
                        {value === item.id && (
                          <Check size={12} strokeWidth={3} />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
