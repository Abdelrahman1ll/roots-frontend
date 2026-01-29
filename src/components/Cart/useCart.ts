import {
  useGetCartQuery,
  usePatchCartMutation,
  useDeleteCartMutation,
} from "../../redux/Cart/apiCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
/**
 * useCart: Logic for managing cart items, quantities, and removal.
 * خطاف السلة: منطق إدارة منتجات السلة والكميات والحذف.
 */
export default function UseCart() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCartQuery({});
  const [deleteCart] = useDeleteCartMutation();
  const [patchCart] = usePatchCartMutation();

  const decreaseQuantity = async ({
    id,
    quantity,
  }: {
    id: number;
    quantity: number;
  }) => {
    if (quantity <= 1) {
      toast.info("Minimum quantity reached");
      return;
    }

    try {
      await patchCart({
        id: String(id),
        data: { quantity: quantity - 1 },
      });
    } catch {
      toast.error("Error decreasing quantity");
    }
  };

  const increaseQuantity = async ({
    id,
    quantity,
  }: {
    id: number;
    quantity: number;
  }) => {
    if (quantity >= 15) {
      toast.info("Maximum quantity reached");
      return;
    }

    try {
      await patchCart({
        id: String(id),
        data: { quantity: quantity + 1 },
      });
    } catch {
      toast.error("Error increasing quantity");
    }
  };

  const removeItem = async (id: number) => {
    try {
      await deleteCart(String(id));
    } catch {
      toast.error("Error removing item");
    }
  };

  return {
    data,
    isLoading,
    isError,
    decreaseQuantity,
    increaseQuantity,
    removeItem,
    navigate,
  };
}
