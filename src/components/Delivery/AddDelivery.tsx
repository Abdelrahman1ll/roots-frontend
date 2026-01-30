import { motion } from "framer-motion";
import { useState } from "react";
import {
  useGetDeliveryQuery,
  usePostDeliveryMutation,
  usePostFreeDeliveryMutation,
} from "../../redux/Delivery/apiDelivery";
import { toast } from "react-toastify";
import { ChevronDown, PackageSearch } from "lucide-react";

interface DeliveryType {
  id: number;
  deliveryPriceClose: number;
  deliveryPriceFar: number;
  freeDelivery: boolean;
}

export default function DeliveryPrice() {
  const [priceClose, setPriceClose] = useState("");
  const [priceFar, setPriceFar] = useState("");

  const [postDelivery, { isLoading }] = usePostDeliveryMutation();
  const { data, refetch } = useGetDeliveryQuery({});

  const delivery = data?.deliveries.find((d: DeliveryType) => d.id === 1);

  const handleAddDelivery = async () => {
    if (!priceClose || Number(priceClose) <= 0) {
      toast.error("Please enter a valid close delivery price");
      return;
    }

    if (!priceFar || Number(priceFar) <= 0) {
      toast.error("Please enter a valid far delivery price");
      return;
    }

    try {
      await postDelivery({
        deliveryPriceClose: Number(priceClose),
        deliveryPriceFar: Number(priceFar),
      }).unwrap();

      refetch();
      setPriceClose("");
      setPriceFar("");
      toast.success("Delivery prices updated successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update delivery prices");
    }
  };

  const [postFreeDelivery] = usePostFreeDeliveryMutation({});
  const [openPanel, setOpenPanel] = useState(false);

  const handleFreeDelivery = async () => {
    try {
      await postFreeDelivery({}).unwrap();
      toast.success("Free Delivery Activated!");
      refetch();
    } catch {
      toast.error("Failed to activate free delivery");
    }
  };

  return (
    <div className="min-h-screen bg-(--color-cornsilk) flex flex-col items-center py-12 px-4 md:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        {/* Header Section */}
        <div className="text-left mb-12 border-b border-(--color-border) pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <PackageSearch size={20} className="text-(--color-dark)" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-pakistan)">
              Administrative Panel
            </span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-dark) tracking-tight mb-4">
            Delivery pricing
          </h1>
          <p className="text-(--color-pakistan) font-medium max-w-lg leading-relaxed text-sm">
            Configure tiered shipping rates and global promotions for your
            customers.
          </p>
        </div>

        {/* Main Interface Card */}
        <div className="bg-white border border-(--color-border) p-6 md:p-10 rounded-none shadow-sm mb-12">
          {/* Current Status Display */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white border border-(--color-border) p-6 text-center group hover:border-(--color-dark) transition-all">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-pakistan) mb-2">
                Near areas
              </p>
              <p className="text-3xl font-bold text-(--color-dark)">
                {delivery?.deliveryPriceClose || 0}
                <span className="text-xs ml-1 opacity-50 font-medium">EGP</span>
              </p>
            </div>

            <div className="bg-white border border-(--color-border) p-6 text-center group hover:border-(--color-dark) transition-all">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-pakistan) mb-2">
                Far areas
              </p>
              <p className="text-3xl font-bold text-(--color-dark)">
                {delivery?.deliveryPriceFar || 0}
                <span className="text-xs ml-1 opacity-50 font-medium">EGP</span>
              </p>
            </div>
          </div>

          {/* Pricing Inputs */}
          <div className="space-y-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Near region rate
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={priceClose}
                  onChange={(e) => setPriceClose(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-(--color-pakistan) tracking-widest">
                Far region rate
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={priceFar}
                  onChange={(e) => setPriceFar(e.target.value)}
                  placeholder="Ex: 100"
                  className="w-full px-4 py-3 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-medium text-(--color-dark) placeholder:text-gray-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAddDelivery}
            disabled={isLoading}
            className="w-full py-4 bg-(--color-dark) text-white font-bold tracking-widest text-[10px] uppercase shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading ? "Synchronizing..." : "Update shipping rates"}
          </motion.button>

          {/* Advanced Settings Logic */}
          <div className="mt-12 pt-10 border-t border-(--color-border)">
            <button
              onClick={() => setOpenPanel(!openPanel)}
              className="w-full py-4 border border-(--color-border) bg-white text-(--color-dark) font-bold text-[10px] uppercase tracking-[0.2em] shadow-sm transition-all flex items-center justify-center gap-3 hover:border-(--color-dark)"
            >
              {openPanel ? "Minimize settings" : "Advanced configuration"}
              <motion.span
                animate={{ rotate: openPanel ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: openPanel ? "auto" : 0,
                opacity: openPanel ? 1 : 0,
                marginTop: openPanel ? 24 : 0,
              }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="p-8 border border-(--color-border) bg-white shadow-sm space-y-8">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-(--color-dark) tracking-tight mb-4">
                    Global free delivery
                  </h3>

                  {delivery?.freeDelivery ? (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex flex-col items-center gap-2 p-6 bg-(--color-pakistan)/5 border border-(--color-pakistan)/10 w-full"
                    >
                      <div className="w-10 h-10 rounded-none bg-(--color-pakistan) flex items-center justify-center text-white mb-2 shadow-sm">
                        ✓
                      </div>
                      <p className="text-(--color-pakistan) font-bold text-[10px] uppercase tracking-widest">
                        Active promotion
                      </p>
                      <p className="text-(--color-pakistan) text-xs font-medium">
                        Zero-cost shipping is currently applied globally
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex flex-col items-center gap-2 p-6 bg-gray-50 border border-gray-100 w-full"
                    >
                      <div className="w-10 h-10 rounded-none bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
                        !
                      </div>
                      <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                        Standard billing
                      </p>
                      <p className="text-gray-400 text-xs font-medium">
                        Calculated rates are active for all shipments
                      </p>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleFreeDelivery}
                  className={`w-full py-4 text-white font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all
                    ${delivery?.freeDelivery ? "bg-red-500 hover:bg-red-600" : "bg-(--color-pakistan) hover:bg-(--color-dark)"}`}
                >
                  {delivery?.freeDelivery
                    ? "Deactivate free delivery"
                    : "Override to free shipping"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
