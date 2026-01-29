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
            <PackageSearch size={14} />
            Inventory Control
          </div>
          <h1 className="text-4xl font-black text-(--color-pakistan) tracking-tight mb-2">
            Categories
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium">
            Organize and manage your product classification system
          </p>
        </motion.div>

        {/* Management Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl p-6 mb-10"
        >
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1 group">
              <input
                value={name}
                data-testid="category-name-input"
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Luxury Collection"
                className="w-full pl-6 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-pakistan)/20 group-focus-within:text-(--color-tiger) transition-colors">
                <Plus size={20} />
              </div>
            </div>
 
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-10 py-4 rounded-2xl bg-linear-to-r from-(--color-tiger) to-(--color-earth) text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-(--color-tiger)/20 transition-all flex items-center justify-center gap-2"
            >
              {editId ? <Edit size={16} /> : <Plus size={16} />}
              {editId ? "Update" : "Create"}
            </motion.button>
          </form>
        </motion.div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories?.categories?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/20 backdrop-blur-sm rounded-3xl border border-dashed border-white/60"
            >
              <PackageSearch
                size={60}
                className="mx-auto text-(--color-pakistan)/20 mb-4"
              />
              <p className="text-(--color-pakistan)/40 font-black uppercase tracking-widest text-xs">
                Classification vault is empty
              </p>
            </motion.div>
          ) : (
            categories?.categories?.map((cat: CategoryType, index: number) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/60 hover:bg-white/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-(--color-tiger)" />
                  <span className="text-lg font-bold text-(--color-pakistan) tracking-tight">
                    {cat.name}
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(cat)}
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
                    onClick={() => handleDelete(cat.id)}
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
