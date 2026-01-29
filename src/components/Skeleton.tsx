import { motion } from "framer-motion";

/**
 * Skeleton: Loading placeholders for products and list items.
 * الهياكل المؤقتة: عناصر نائبة للتحميل للمنتجات وقوائم العناصر.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-2xl animate-pulse ${className}`} />
  );
}

export function SkeletonList({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className="grid gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`h-16 w-full ${className || ""}`}
        >
          <Skeleton className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
}
