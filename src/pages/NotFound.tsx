import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer/footer";
import Header from "../components/Header/header";
import PromoBar from "../components/Header/PromoBar";

export default function NotFound() {
  return (
    <>
      <PromoBar />
      <Header />
      <BackButton />

      <div className="relative min-h-[80vh] flex items-center justify-center py-24 px-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-[120px] md:text-[160px] font-bold text-(--color-dark) leading-none tracking-tighter">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <div className="mb-12 space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-(--color-dark)">
              Page Not Found
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-(--color-pakistan) leading-relaxed max-w-xs mx-auto">
              The requested resource could not be found. Please return to the
              main collection.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/" className="w-full sm:w-auto">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full px-10 py-4 rounded-none bg-white border border-black text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                Home
              </motion.button>
            </Link>

            <Link to="/products" className="w-full sm:w-auto">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full px-10 py-4 rounded-none bg-black text-white font-bold uppercase tracking-[0.2em] text-[10px] border border-black hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
              >
                Collection
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
