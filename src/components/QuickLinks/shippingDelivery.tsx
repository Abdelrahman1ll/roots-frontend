import { motion } from "framer-motion";
import { Truck, MapPin, Clock, CreditCard } from "lucide-react";
import { useGetDeliveryQuery } from "../../redux/Delivery/apiDelivery";

/**
 * ShippingDelivery: Details on shipping rates and delivery times.
 * الشحن والتوصيل: تفاصيل عن أسعار الشحن ومواعيد التسليم.
 */
export default function ShippingDelivery() {
  const { data, isLoading } = useGetDeliveryQuery({});

  const deliveryData = data?.deliveries?.find(
    (d: { id: number }) => d.id === 1,
  );

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

  const shippingInfo = [
    {
      icon: Truck,
      en: "Standard Shipping: Nationwide coverage across all governorates.",
      ar: "الشحن القياسي: تغطية شاملة لجميع محافظات الجمهورية.",
      price: isLoading
        ? "..."
        : `${deliveryData?.deliveryPriceClose || 60} EGP`,
      type: "Most Governorates",
    },
    {
      icon: MapPin,
      en: "Southern Governorates & South Sinai (Upper Egypt, Sharm El Sheikh).",
      ar: "محافظات الجنوب وسيناء الجنوبية (صعيد مصر، شرم الشيخ).",
      price: isLoading ? "..." : `${deliveryData?.deliveryPriceFar || 80} EGP`,
      type: "Southern Areas",
    },
    {
      icon: Clock,
      en: "Delivery Timeframe: Usually takes 3–7 working days.",
      ar: "مدة التوصيل: تستغرق عادة من 3 إلى 7 أيام عمل.",
      price: "3-7 Days",
      type: "Fast Delivery",
    },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 md:p-10 mt-10 md:mt-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-5xl bg-white border border-(--color-border) p-8 md:p-16"
      >
        <div className="text-center mb-16 space-y-4">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-light text-(--color-dark) tracking-tight uppercase"
          >
            Shipping <span className="font-bold">Info</span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-(--color-border) max-w-[100px] mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shippingInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group bg-white p-8 border border-gray-100 hover:border-(--color-dark) transition-all flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-6 text-(--color-dark) border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                <info.icon size={20} strokeWidth={1.5} />
              </div>

              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {info.type}
                  </p>
                  <p className="text-2xl font-bold text-(--color-dark)">
                    {info.price}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-50 bg-transparent">
                  <p className="text-sm font-medium text-gray-600 leading-relaxed capitalize">
                    {info.en}
                  </p>
                  <p
                    className="text-sm font-light text-gray-400 leading-relaxed"
                    dir="rtl"
                  >
                    {info.ar}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center flex items-center justify-center gap-3"
        >
          <CreditCard className="text-gray-400" size={16} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Secure Payments Upon Delivery or Online
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
