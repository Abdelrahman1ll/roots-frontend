import { motion } from "framer-motion";

/**
 * MotionZoomImage: Interactive image component with motion effects.
 * صورة التكبير المتحركة: مكون صورة تفاعلي مع تأثيرات الحركة.
 */
export default function MotionZoomImage({
  mainImage,
  product,
}: {
  mainImage: string;
  product: any;
}) {
  return (
    <motion.div className="relative w-full mb-2">
      <motion.img
        key={mainImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        src={mainImage}
        alt={product?.name || "Detailed product view"}
        width={800}
        height={800}
        loading="lazy"
        decoding="async"
        fetchPriority="high"
        className="w-full h-[700px] max-[500px]:h-[500px] md:h-[800px] object-cover select-none cursor-pointer"
        draggable={false}
      />
    </motion.div>
  );
}
