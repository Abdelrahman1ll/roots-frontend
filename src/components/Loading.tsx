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
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "40px" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="h-px bg-(--color-dark) mt-4"
          />
        </motion.div>

        {/* Status Text - Subtle */}
        <p className="text-(--color-pakistan) text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">
          Universal Simplicity
        </p>
      </div>
    </div>
  );
}
