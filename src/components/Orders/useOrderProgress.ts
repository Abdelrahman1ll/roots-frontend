/**
 * useOrderProgress: Logic for determining the active step and coloring in the order progress bar.
 * خطاف تتبع الطلب: منطق لتحديد الخطوة النشطة والتلوين في شريط تتبع الطلب.
 */
import { useEffect, useState } from "react";
import {
  usePatchIsPaidOrdersMutation,
  usePatchIsConfirmedOrdersMutation,
  usePatchIsShippedOrdersMutation,
  usePatchIsDeliveredOrdersMutation,
  usePatchIsCanceledOrdersMutation,
} from "../../redux/Orders/apiOrders";
import type { OrderType } from "../../types/OrderType";

export default function useOrderProgress({ order }: { order: OrderType }) {
  const [patchIsPaid] = usePatchIsPaidOrdersMutation();
  const [patchIsConfirmed] = usePatchIsConfirmedOrdersMutation();
  const [patchIsShipped] = usePatchIsShippedOrdersMutation();
  const [patchIsDelivered] = usePatchIsDeliveredOrdersMutation();
  const [patchIsCanceled] = usePatchIsCanceledOrdersMutation();

  const [isPaid, setIsPaid] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isShipped, setIsShipped] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    setIsPaid(order?.isPaid);
    setIsConfirmed(order?.isConfirmed);
    setIsShipped(order?.isShipped);
    setIsDelivered(order?.isDelivered);
    setIsCanceled(order?.isCanceled);
  }, [order]);

  const btnBaseClasses =
    "flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm transition cursor-pointer";

  const getBtnStyle = (active: boolean, color: string) =>
    active
      ? {
          borderColor: color,
          backgroundColor: color + "33", // 20% opacity
          color: color,
        }
      : {};

  return {
    isPaid,
    isConfirmed,
    isShipped,
    isDelivered,
    isCanceled,
    btnBaseClasses,
    getBtnStyle,
    patchIsPaid,
    patchIsConfirmed,
    patchIsShipped,
    patchIsDelivered,
    patchIsCanceled,
  };
}
