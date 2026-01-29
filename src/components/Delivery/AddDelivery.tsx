import { motion } from "framer-motion";
import { useState } from "react";
import {
  useGetDeliveryQuery,
  usePostDeliveryMutation,
  usePostFreeDeliveryMutation,
} from "../../redux/Delivery/apiDelivery";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";

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
    <div className="relative min-h-screen py-20 px-4 overflow-hidden">
      {/* Dynamic Radial Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(188,108,37,0.1)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(96,108,56,0.05)_0%,transparent_50%)]" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-(--color-tiger) font-black text-xs uppercase tracking-widest mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-tiger) opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-(--color-tiger)"></span>
            </span>
            Logistics Control
          </motion.div>
          <h1 className="text-4xl font-black text-(--color-pakistan) tracking-tight mb-2">
            Delivery Pricing
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium font-['Outfit']">
            Configure tiered shipping rates and global promotions
          </p>
        </div>

        {/* Main Interface Card */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
          {/* Current Status Display */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/30 backdrop-blur-md border border-white/60 rounded-3xl p-6 text-center group hover:bg-white/50 transition-all duration-300">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-(--color-pakistan)/40 mb-2">
                Near Areas
              </p>
              <p className="text-3xl font-black text-(--color-pakistan)">
                {delivery?.deliveryPriceClose || 0}
                <span className="text-xs ml-1 opacity-50 font-medium">EGP</span>
              </p>
            </div>

            <div className="bg-white/30 backdrop-blur-md border border-white/60 rounded-3xl p-6 text-center group hover:bg-white/50 transition-all duration-300">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-(--color-pakistan)/40 mb-2">
                Far Areas
              </p>
              <p className="text-3xl font-black text-(--color-pakistan)">
                {delivery?.deliveryPriceFar || 0}
                <span className="text-xs ml-1 opacity-50 font-medium">EGP</span>
              </p>
            </div>
          </div>

          {/* Pricing Inputs */}
          <div className="space-y-4 mb-8">
            <div className="relative group">
              <input
                type="number"
                value={priceClose}
                onChange={(e) => setPriceClose(e.target.value)}
                placeholder="Near Region Rate"
                className="w-full bg-white/50 border border-white/60 rounded-2xl px-6 py-4 font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 focus:bg-white/80 focus:border-(--color-tiger) focus:ring-4 focus:ring-(--color-tiger)/5 outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <input
                type="number"
                value={priceFar}
                onChange={(e) => setPriceFar(e.target.value)}
                placeholder="Far Region Rate"
                className="w-full bg-white/50 border border-white/60 rounded-2xl px-6 py-4 font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 focus:bg-white/80 focus:border-(--color-tiger) focus:ring-4 focus:ring-(--color-tiger)/5 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddDelivery}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-linear-to-r from-(--color-tiger) to-(--color-earth) text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-(--color-tiger)/20 transition-all disabled:opacity-50"
          >
            {isLoading ? "Synchronizing..." : "Update Shipping Rates"}
          </motion.button>

          {/* Advanced Settings Logic */}
          <div className="mt-10 pt-8 border-t border-white/40">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenPanel(!openPanel)}
              className="w-full py-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 text-(--color-pakistan) font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3"
            >
              {openPanel ? "Minimize Settings" : "Advanced Configuration"}
              <motion.span
                animate={{ rotate: openPanel ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </motion.button>

            <motion.div
              initial={false}
              animate={{
                height: openPanel ? "auto" : 0,
                opacity: openPanel ? 1 : 0,
                marginTop: openPanel ? 16 : 0,
              }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-3xl border border-white/60 bg-white/30 backdrop-blur-xl shadow-inner space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-black text-(--color-pakistan) tracking-tight mb-4">
                    Global Free Delivery
                  </h3>

                  {delivery?.freeDelivery ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex flex-col items-center gap-2 p-6 bg-[#606C38]/10 rounded-2xl border border-[#606C38]/20 w-full"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#606C38] flex items-center justify-center text-white mb-2 shadow-lg shadow-[#606C38]/20">
                        ✓
                      </div>
                      <p className="text-[#606C38] font-black uppercase tracking-widest text-xs">
                        Active Promotion
                      </p>
                      <p className="text-(--color-pakistan)/60 text-[10px] font-bold">
                        Zero-cost shipping is currently applied globally
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex flex-col items-center gap-2 p-6 bg-(--color-tiger)/5 rounded-2xl border border-(--color-tiger)/10 w-full"
                    >
                      <div className="w-12 h-12 rounded-full bg-(--color-tiger)/20 flex items-center justify-center text-(--color-tiger) mb-2">
                        !
                      </div>
                      <p className="text-(--color-tiger) font-black uppercase tracking-widest text-xs">
                        Standard Billing
                      </p>
                      <p className="text-(--color-pakistan)/60 text-[10px] font-bold">
                        Calculated rates are active for all shipments
                      </p>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 30px -10px rgba(96,108,56,0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFreeDelivery}
                  className="w-full py-4 rounded-2xl bg-linear-to-r from-(--color-earth) to-[#606C38] text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all"
                >
                  {delivery?.freeDelivery
                    ? "Deactivate Free Delivery"
                    : "Override to Free Shipping"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
