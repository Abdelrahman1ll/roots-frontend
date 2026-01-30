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
    <div className="min-h-screen bg-(--color-cornsilk) flex flex-col items-center py-12 px-4 md:px-6">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-12 border-b border-(--color-border) pb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Palette size={20} className="text-(--color-dark)" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-pakistan)">
              Administrative Panel
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-dark) tracking-tight mb-4">
            Color palette
          </h1>
          <p className="text-(--color-pakistan) font-medium max-w-lg leading-relaxed text-sm">
            Define and manage the aesthetic spectrum of your products in the
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
            className="flex flex-col sm:flex-row gap-6 items-end"
          >
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Color name
              </label>
              <div className="relative group">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Midnight Black"
                  className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="w-full sm:w-auto space-y-1.5">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Hex code
              </label>
              <div className="flex gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => colorInputRef.current?.click()}
                    className="w-12 h-12 border border-(--color-border) rounded-none flex items-center justify-center cursor-pointer transition-all shadow-sm"
                    style={{ backgroundColor: color }}
                    title="Pick Color"
                  >
                    <Palette
                      size={16}
                      className={`${parseInt(color.replace("#", ""), 16) > 0xffffff / 1.5 ? "text-gray-800" : "text-white"} drop-shadow-sm`}
                    />
                  </button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-24 px-3 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-mono text-[11px] text-(--color-dark)"
                />
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-(--color-dark) text-white font-bold tracking-[0.2em] text-[10px] py-4 px-10 rounded-none shadow-sm hover:bg-black transition-all group"
              >
                {editId ? <Edit size={14} /> : <Plus size={14} />}
                {editId ? "Update color" : "Register color"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Colors List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-(--color-dark) tracking-widest">
              Existing palette
            </h3>
          </div>

          {colors?.colors?.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-(--color-border) rounded-none">
              <Palette size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-(--color-pakistan) text-sm font-medium">
                The palette is currently empty
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colors?.colors?.map((colorItem: ColorType, index: number) => (
                <motion.div
                  key={colorItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center justify-between p-4 bg-white border border-(--color-border) rounded-none hover:border-(--color-dark) transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 border border-(--color-border) rounded-none shadow-sm"
                      style={{ backgroundColor: colorItem.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-(--color-dark) tracking-wide">
                        {colorItem.name}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">
                        {colorItem.color}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(colorItem)}
                      className="text-(--color-pakistan) hover:text-(--color-dark) transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(colorItem.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
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
