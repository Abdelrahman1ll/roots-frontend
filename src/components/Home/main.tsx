import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { getCloudinaryUrl, getCloudinarySrcSet } from "../../utils/cloudinary";
import { useRef } from "react";

/*
╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                      ║
║  [ENGLISH]                                                                                           ║
║  Update these IDs after uploading the 3 new generated images to your Cloudinary account.             ║
║  The new images match the 'Roots Archive' premium aesthetic.                                         ║
║                                                                                                      ║
║  [ARABIC]                                                                                            ║
║  قم بتحديث هذه المعرفات (IDs) بعد رفع الصور الثلاث الجديدة التي تم إنشاؤها إلى حساب Cloudinary الخاص بك. ║
║  الصور الجديدة تتماشى مع المظهر الفاخر لـ 'Roots Archive'.                                            ║
║                                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

const HERO_IMG_1 = "v1777847820/hero1_bwwsrm.jpg";
const HERO_IMG_2 = "v1777847824/hero2_klnwmk.jpg";
const HERO_IMG_3 = "v1777847830/hero3_temwcg.jpg";

export default function Main() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);

  return (
    <div ref={containerRef} className="bg-white">
      {/* SCREEN 1: Full-Screen Overlay */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0">
          <img
            src={getCloudinaryUrl(HERO_IMG_1, { width: 1920 })}
            srcSet={getCloudinarySrcSet(HERO_IMG_1)}
            alt="Hero Background"
            className="w-full h-full object-cover grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-light tracking-[-0.05em] text-white leading-none drop-shadow-2xl uppercase">
                Roots Archive
              </h1>
              <p className="text-sm md:text-base text-white/80 max-w-md mx-auto leading-relaxed tracking-wider font-medium drop-shadow-lg">
                Universal simplicity. Curated for the modern soul.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-16 py-6 bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase transition-all shadow-2xl"
                >
                  Shop Collection
                </motion.button>
              </Link>
              <Link to="/about-us">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white border-b border-white/40 pb-2 hover:border-white transition-all cursor-pointer">
                  Explore Story
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Minimal Scroll Hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-white/40" />
        </motion.div>
      </section>

      {/* SCREEN 2: Dual Side-by-Side Images */}
      <section className="h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white px-6 py-8">
        <div className="relative h-full overflow-hidden">
          <img
            src={getCloudinaryUrl(HERO_IMG_2, { width: 1000 })}
            alt="Detail view 1"
            className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-[2s]"
          />
        </div>
        <div className="relative h-full overflow-hidden">
          <img
            src={getCloudinaryUrl(HERO_IMG_3, { width: 1000 })}
            alt="Detail view 2"
            className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-[2s]"
          />
        </div>
      </section>
    </div>
  );
}
