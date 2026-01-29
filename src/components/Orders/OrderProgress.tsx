import {
  CheckCircle2,
  DollarSign,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import type { OrderType } from "../../types/OrderType";
import useOrderProgress from "./useOrderProgress";

/**
 * OrderProgress: Visual indicator (stepper) showing the current status of an order.
 * تتبع الطلب: مؤشر مرئي يوضح الحالة الحالية لمعالجة الطلب.
 */
export default function OrderProgress({
  order,
  refetch,
}: {
  order: OrderType;
  refetch: () => void;
}) {
  const {
    isPaid,
    isConfirmed,
    isShipped,
    isDelivered,
    isCanceled,
    patchIsPaid,
    patchIsConfirmed,
    patchIsShipped,
    patchIsDelivered,
    patchIsCanceled,
  } = useOrderProgress({ order });
  return (
    <div className="mt-12 pt-12 border-t border-gray-50">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 text-center">
        Status Management Protocol
      </h3>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center max-w-4xl mx-auto">
        {[
          {
            label: "Paid",
            icon: DollarSign,
            active: isPaid,
            activeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
            action: patchIsPaid,
          },
          {
            label: "Confirmed",
            icon: CheckCircle2,
            active: isConfirmed,
            activeClass: "bg-blue-100 text-blue-700 border-blue-200",
            action: patchIsConfirmed,
          },
          {
            label: "Shipped",
            icon: Package,
            active: isShipped,
            activeClass: "bg-orange-100 text-orange-700 border-orange-200",
            action: patchIsShipped,
          },
          {
            label: "Delivered",
            icon: Truck,
            active: isDelivered,
            activeClass: "bg-green-100 text-green-700 border-green-200",
            action: patchIsDelivered,
          },
          {
            label: "Canceled",
            icon: XCircle,
            active: isCanceled,
            activeClass: "bg-red-100 text-red-700 border-red-200",
            action: patchIsCanceled,
          },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={async () => {
              await btn.action(order?.id);
              refetch();
            }}
            className={`group relative flex items-center justify-center gap-3 px-6 py-4 rounded-none font-black uppercase tracking-widest transition-all duration-300 border text-[10px] w-full sm:w-auto ${
              btn.active
                ? btn.activeClass
                : "bg-white border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            <btn.icon
              size={12}
              className="transition-transform group-hover:scale-110 shrink-0"
            />
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
