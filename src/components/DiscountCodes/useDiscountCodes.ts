import {
  useGetDiscountCodesQuery,
  usePostDiscountCodesMutation,
  usePatchDiscountCodesMutation,
  useDeleteDiscountCodesMutation,
} from "../../redux/DiscountCodes/apiDiscountCodes";
import { toast } from "react-toastify";
import { formatEndDateArabic } from "../../utils/formatters";
import { useRef, useState } from "react";
import type { DiscountCodeType } from "../../types/DiscountCodeType";
/**
 * useDiscountCodes: CRUD logic for managing discount codes and their validation.
 * خطاف أكواد الخصم: منطق العمليات الأساسية لإدارة أكواد الخصم والتحقق منها.
 */
export default function useDiscountCodes() {
  const reviewFormRef = useRef<HTMLDivElement>(null);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetDiscountCodesQuery({});
  const [postDiscountCodes, { isLoading: isAdding }] =
    usePostDiscountCodesMutation();
  const [patchDiscountCodes, { isLoading: isEditing }] =
    usePatchDiscountCodesMutation();
  const [deleteDiscountCodes, { isLoading: isDeleting }] =
    useDeleteDiscountCodesMutation();

  const handleAddOrSave = async () => {
    const code = newCode.trim().toUpperCase();
    const discountNum = Number(newDiscount);
    const expiry = newExpiry.trim();

    if (!code || !isNaN(Number(code)) || !newDiscount || !expiry) {
      toast.error("Please fill all fields");
      return;
    }

    if (isNaN(discountNum) || discountNum <= 0 || discountNum > 100) {
      toast.error("Discount must be a number between 1 and 100");
      return;
    }

    const parsed = new Date(expiry);
    if (isNaN(parsed.getTime())) {
      toast.error("Invalid expiry date");
      return;
    }

    if (parsed.getTime() <= Date.now()) {
      toast.error("End date must be in the future");
      return;
    }

    try {
      if (editingId) {
        // تعديل
        await patchDiscountCodes({
          id: editingId,
          data: {
            code: code,
            discount: Number(newDiscount),
            EndDate: newExpiry,
          },
        }).unwrap();
      } else {
        // إضافة
        await postDiscountCodes({
          code: code,
          discount: Number(newDiscount),
          EndDate: newExpiry,
        }).unwrap();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to add/edit discount code");
    }
    setNewCode("");
    setNewDiscount("");
    setNewExpiry("");
    setEditingId(null);

    refetch();
  };

  const handleEdit = (item: DiscountCodeType) => {
    setEditingId(item.id);
    setNewCode(item.code);
    setNewDiscount(item.discount.toString());
    setNewExpiry(item.EndDate.split("T")[0]);
    reviewFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDiscountCodes(id).unwrap();
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete discount code");
    }
  };

  return {
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
  };
}
