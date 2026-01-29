import { motion } from "framer-motion";
import { Globe, Plane, MapPin } from "lucide-react";

export default function WorldwideShipping() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const shippingFeatures = [
    {
      icon: Globe,
      title: "All Governorates",
      titleAr: "جميع المحافظات",
      desc: "We deliver our luxury boutique collections to every city and governorate across Egypt.",
      descAr:
        "نقوم بتوصيل مجموعاتنا الفاخرة إلى كل مدينة ومحافظة في جميع أنحاء مصر.",
    },
    {
      icon: Plane,
      title: "Domestic Logistics",
      titleAr: "خدمات لوجستية محلية",
      desc: "Orders are handled by premium local couriers to ensure safety and speed.",
      descAr:
        "يتم التعامل مع الطلبات من قبل شركات نقل محلية ممتازة لضمان الأمان والسرعة.",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      titleAr: "تتبع اللحظي",
      desc: "Complete transparency with step-by-step tracking from our warehouse to your door.",
      descAr: "شفافية كاملة مع تتبع خطوة بخطوة من مستودعنا إلى باب منزلك.",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 md:px-10 mt-10 md:mt-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-white border border-(--color-border) p-8 md:p-16"
      >
        <div className="text-center mb-16 space-y-4">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-light text-(--color-dark) tracking-tight uppercase"
          >
            Shipping in <span className="font-bold">Egypt</span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-(--color-border) max-w-[100px] mx-auto"
          />
        </div>

        <div className="space-y-12">
          {shippingFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group flex flex-col md:flex-row gap-6 md:gap-10 pb-12 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="w-12 h-12 flex items-center justify-center shrink-0 text-(--color-dark) bg-gray-50">
                <feature.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-(--color-dark)">
                    {feature.title}
                  </h3>
                  <span className="hidden md:block text-gray-300">|</span>
                  <h3 className="text-sm font-medium text-gray-400" dir="rtl">
                    {feature.titleAr}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                  <p
                    className="text-sm text-gray-400 leading-relaxed font-light"
                    dir="rtl"
                  >
                    {feature.descAr}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-100 flex justify-around text-center"
        >
          <div className="space-y-1">
            <p className="text-2xl font-light text-(--color-dark)">27</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Governorates
            </p>
          </div>
          <div className="w-px h-12 bg-gray-100" />
          <div className="space-y-1">
            <p className="text-2xl font-light text-(--color-dark)">3-7</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Days
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
