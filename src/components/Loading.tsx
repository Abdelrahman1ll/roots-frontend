import { motion } from "framer-motion";
import { BRAND_NAME } from "../BrandText";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-9999 bg-white transition-opacity duration-700">
      <div className="flex flex-col items-center gap-8">
        {/* Minimal Brand Identifier */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h2 className="text-(--color-dark) font-light tracking-[1em] uppercase text-2xl select-none">
            {BRAND_NAME}
          </h2>
          <div className="flex gap-2 mt-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-(--color-dark) rounded-full"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Status Text - Subtle */}
        <p className="text-(--color-pakistan) text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">
          Universal Simplicity
        </p>
      </div>
    </div>
  );
}
