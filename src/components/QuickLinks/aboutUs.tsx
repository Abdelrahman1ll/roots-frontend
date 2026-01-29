import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

/**
 * AboutUs: Brand story and values presentation.
 * من نحن: عرض قصة العلامة التجارية وقيمها.
 */
export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const values = [
    {
      icon: Sparkles,
      en: "We are a contemporary clothing brand blending comfort and premium quality.",
      ar: "نحن علامة ملابس عصرية تجمع بين الراحة والجودة العالية.",
      color: "var(--color-tiger)",
    },
    {
      icon: ShieldCheck,
      en: "Our designs offer a calm, confident style for every occasion.",
      ar: "تصاميمنا تمنحك أسلوبًا هادئًا وواثقًا لكل مناسبة.",
      color: "var(--color-pakistan)",
    },
    {
      icon: Heart,
      en: "Combining practicality with refined taste to reflect your unique identity.",
      ar: "تجمع بين العملية والذوق الرفيع لتعكس هويتك الفريدة.",
      color: "var(--color-earth)",
    },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 md:px-10 py-16 md:py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-4xl bg-white border border-(--color-border) p-8 md:p-16"
      >
        <div className="text-center mb-16 space-y-4">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-light text-(--color-dark) tracking-tight uppercase"
          >
            Our <span className="font-bold">Story</span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-(--color-border) max-w-[100px] mx-auto"
          />
        </div>

        <div className="space-y-12">
          {values.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-8 items-start group border-b border-gray-100 pb-12 last:border-none last:pb-0"
            >
              <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-gray-200 text-(--color-dark)">
                <item.icon size={20} strokeWidth={1.5} />
              </div>

              <div className="space-y-3 grow">
                <p className="text-lg font-medium text-(--color-dark) leading-relaxed">
                  {item.en}
                </p>
                <p
                  className="text-lg font-light text-gray-400 leading-relaxed md:text-right"
                  dir="rtl"
                >
                  {item.ar}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
