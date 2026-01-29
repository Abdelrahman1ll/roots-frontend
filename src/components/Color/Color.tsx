import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Palette } from "lucide-react";
import { SkeletonList } from "../Skeleton";
import {
  useGetColorsQuery,
  usePostColorMutation,
  usePatchColorMutation,
  useDeleteColorMutation,
} from "../../redux/color/apiColor";
import { toast } from "react-toastify";

interface ColorType {
  id: number;
  name: string;
  color: string;
}

/**
 * Color: Administrative interface for managing product color options.
 * الألوان: واجهة إدارية لإدارة خيارات ألوان المنتجات.
 */
export default function Color() {
  const { data: colors, isLoading, error, refetch } = useGetColorsQuery({});
  const [postColor] = usePostColorMutation();
  const [patchColor] = usePatchColorMutation();
  const [deleteColor] = useDeleteColorMutation();

  const colorInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [color, setColor] = useState("#000000");

  /* ===================== Submit ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !color) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editId) {
        await patchColor({ id: editId, data: { name, color } }).unwrap();
      } else {
        await postColor({ name, color }).unwrap();
      }

      setName("");
      setEditId(null);
      setColor("#000000");
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to save color");
    }
  };

  /* ===================== Edit ===================== */
  const handleEdit = (colorItem: ColorType) => {
    setName(colorItem.name);
    setEditId(colorItem.id);
    setColor(colorItem.color);
  };

  /* ===================== Delete ===================== */
  const handleDelete = async (id: number) => {
    try {
      await deleteColor(id).unwrap();
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete color");
    }
  };

  /* ===================== Loading ===================== */
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
        <Palette size={80} className="text-red-500 mb-4" />
        <p className="text-gray-500 text-lg">Failed to load colors</p>
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
            <Palette size={14} />
            Visual Identity
          </div>
          <h1 className="text-4xl font-black text-(--color-pakistan) tracking-tight mb-2">
            Color Palette
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium">
            Define and manage the aesthetic spectrum of your products
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
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <div className="flex flex-1 w-full gap-3 items-center">
              <div className="relative flex-1 group">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Midnight Black"
                  className="w-full pl-6 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
                />
              </div>

              {/* Glassmorphic Color Picker */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => colorInputRef.current?.click()}
                  className="w-14 h-14 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all shadow-lg relative overflow-hidden group"
                  style={{ backgroundColor: color }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors shadow-inner" />
                  <Palette size={20} className="text-white drop-shadow-md" />
                </motion.button>

                <input
                  ref={colorInputRef}
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-linear-to-r from-(--color-tiger) to-(--color-earth) text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-(--color-tiger)/20 transition-all flex items-center justify-center gap-2"
            >
              {editId ? <Edit size={16} /> : <Plus size={16} />}
              {editId ? "Update" : "Register"}
            </motion.button>
          </form>
        </motion.div>

        {/* Colors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colors?.colors?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20 bg-white/20 backdrop-blur-sm rounded-3xl border border-dashed border-white/60"
            >
              <Palette
                size={60}
                className="mx-auto text-(--color-pakistan)/20 mb-4"
              />
              <p className="text-(--color-pakistan)/40 font-black uppercase tracking-widest text-xs">
                The palette is currently empty
              </p>
            </motion.div>
          ) : (
            colors?.colors?.map((colorItem: ColorType, index: number) => (
              <motion.div
                key={colorItem.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/60 hover:bg-white/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl shadow-lg border border-white/60"
                    style={{ backgroundColor: colorItem.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-(--color-pakistan) tracking-tight leading-tight">
                      {colorItem.name}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-(--color-pakistan)/40">
                      {colorItem.color}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(colorItem)}
                    className="p-2.5 rounded-xl bg-white/40 border border-white/60 text-(--color-pakistan) hover:text-(--color-tiger) transition-colors"
                  >
                    <Edit size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(colorItem.id)}
                    className="p-2.5 rounded-xl bg-white/40 border border-white/60 text-red-500/60 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
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
