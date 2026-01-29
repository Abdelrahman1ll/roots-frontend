import { useRef, useState } from "react";
import {
  usePostEmailOrderDispatcherMutation,
  useGetEmailOrderDispatcherQuery,
  usePatchEmailOrderDispatcherMutation,
  useDeleteEmailOrderDispatcherMutation,
} from "../../redux/EmailOrderDispatcher/apiEmailOrderDispatcher";
import { toast } from "react-toastify";
import { formatEndDateArabic } from "../../utils/formatters";
import type { OrderEmail } from "../../types/OrderEmailType";
import { validateEmail } from "../../utils/validators";

export default function useEmailOrderDispatcher() {
  const reviewFormRef = useRef<HTMLDivElement>(null);
  const [postEmailOrderDispatcher] = usePostEmailOrderDispatcherMutation();
  const {
    data,
    isLoading: isLoading,
    refetch,
  } = useGetEmailOrderDispatcherQuery({});
  const [patchEmailOrderDispatcher] = usePatchEmailOrderDispatcherMutation();
  const [deleteEmailOrderDispatcher] = useDeleteEmailOrderDispatcherMutation();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const handleSendEmail = async () => {
    let hasError = false;
    const newErrors = { name: "", email: "" };

    // ===== VALIDATE NAME =====
    if (!customerName || customerName.trim() === "") {
      newErrors.name = "Name is required";
      hasError = true;
    }

    // ===== VALIDATE EMAIL =====
    if (!customerEmail || customerEmail.trim() === "") {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(customerEmail)) {
      newErrors.email = "Email is not valid";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "", email: "" });

    try {
      await postEmailOrderDispatcher({
        name: customerName,
        email: customerEmail,
      }).unwrap();
      toast.success("Email sent successfully");
      refetch();
      setCustomerName("");
      setCustomerEmail("");
    } catch {
      toast.error("Error checking email");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmailOrderDispatcher(id).unwrap();
      toast.success("Order deleted successfully");
      refetch();
    } catch {
      toast.error("Error deleting order");
    }
  };

  const handleEdit = (order: OrderEmail) => {
    setEditingId(order.id);
    setCustomerName(order.name);
    setCustomerEmail(order.email);
    reviewFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    let hasError = false;
    const newErrors = { name: "", email: "" };

    if (!customerName || customerName.trim() === "") {
      newErrors.name = "Name is required";
      hasError = true;
    }

    if (!customerEmail || customerEmail.trim() === "") {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(customerEmail)) {
      newErrors.email = "Email is not valid";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "", email: "" });

    try {
      await patchEmailOrderDispatcher({
        id: editingId,
        data: {
          name: customerName,
          email: customerEmail,
        },
      }).unwrap();
      toast.success("Order updated successfully");
      refetch();
      setEditingId(null);
      setCustomerName("");
      setCustomerEmail("");
    } catch {
      toast.error("Error updating order");
    }
  };

  return {
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
  };
}
