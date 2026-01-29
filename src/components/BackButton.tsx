import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackButton() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility based on scroll position if needed,
      // but usually back buttons should remain visible or fade out gently.
      if (window.scrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{
            backgroundColor: "var(--color-dark)",
            color: "white",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={goBack}
          className="fixed top-32 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-none bg-white border border-(--color-dark) cursor-pointer transition-all duration-300 group"
          title="الرجوع للصفحة السابقة"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
