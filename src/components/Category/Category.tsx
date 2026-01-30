import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, PackageSearch } from "lucide-react";
import { SkeletonList } from "../Skeleton";
import {
  useGetCategoryQuery,
  usePostCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/category/apiCategory";
import { toast } from "react-toastify";

interface CategoryType {
  id: number;
  name: string;
}

/**
 * Category: Administrative interface for creating and managing product categories.
 * الأصناف: واجهة إدارية لإنشاء وإدارة فئات (أصناف) المنتجات.
 */
export default function Category() {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoryQuery({});
  const [postCategory] = usePostCategoryMutation();
  const [patchCategory] = usePatchCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      if (editId) {
        await patchCategory({ id: editId, data: { name } }).unwrap();
      } else {
        await postCategory({ name }).unwrap();
      }

      setName("");
      setEditId(null);
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to add category");
    }
  };

  const handleEdit = (cat: CategoryType) => {
    setName(cat.name);
    setEditId(cat.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  /* ===================== Loading Skeleton ===================== */
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-4">
        <SkeletonList count={5} />
      </div>
    );
  }

  /* ===================== Error ===================== */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <PackageSearch size={80} className="text-red-500 mb-4" />
        <p className="text-gray-500 text-lg">Failed to load categories</p>
      </div>
    );
  }

  /* ===================== UI ===================== */
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
            <PackageSearch size={20} className="text-(--color-dark)" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-pakistan)">
              Administrative Panel
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-dark) tracking-tight mb-4">
            Categories
          </h1>
          <p className="text-(--color-pakistan) font-medium max-w-lg leading-relaxed text-sm">
            Organize and manage your product classification system for the
            catalog.
          </p>
        </motion.div>

        {/* Management Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-(--color-border) p-6 md:p-10 rounded-none shadow-sm mb-12"
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-6"
          >
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Category name
              </label>
              <div className="relative group">
                <input
                  value={name}
                  data-testid="category-name-input"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Luxury Collection"
                  className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-(--color-dark) text-white font-bold tracking-[0.2em] text-[10px] py-4 px-10 rounded-none shadow-sm hover:bg-black transition-all group"
              >
                {editId ? <Edit size={14} /> : <Plus size={14} />}
                {editId ? "Update category" : "Create category"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Categories List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
              Existing categories
            </h3>
          </div>

          {categories?.categories?.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-(--color-border) rounded-none">
              <PackageSearch size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-(--color-pakistan) text-sm font-medium">
                Classification vault is empty
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {categories?.categories?.map(
                (cat: CategoryType, index: number) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between p-5 bg-white border border-(--color-border) rounded-none hover:border-(--color-dark) transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-1 h-1 bg-(--color-dark) rounded-none" />
                      <span className="text-sm font-bold text-(--color-dark) tracking-wide">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-(--color-pakistan) hover:text-(--color-dark) transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete"
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
