import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useUI } from "../../context/UIContext";
import "./AddToCartButton.css";

/**
 * AddToCartButton: A reusable button component with loading state for cart operations.
 */
export default function AddToCartButton({
  addToCart,
}: {
  addToCart: () => Promise<boolean>;
}) {
  const { openCart } = useUI();
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    const success = await addToCart();
    if (success) {
      setClicked(true);
      openCart();
      setTimeout(() => setClicked(false), 2000);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className="group/btn relative flex items-center justify-center gap-3 flex-1 h-16 bg-(--color-dark) rounded-none font-bold text-white text-xs uppercase tracking-[0.4em] overflow-hidden transition-all duration-300 hover:bg-black"
    >
      <span className="relative z-10">
        {clicked ? "Added to Archives" : "Add to Bag"}
      </span>
      <ShoppingCart
        size={18}
        strokeWidth={2}
        className={`relative z-10 transition-all duration-500 ${
          clicked ? "scale-110 opacity-0" : "opacity-100"
        }`}
      />

      {/* Premium subtle highlight */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
    </motion.button>
  );
}
