import { motion } from "framer-motion";
import { ShieldCheck, Lock, Smartphone } from "lucide-react";

export default function SecurePayment() {
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

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: "End-to-End Encryption",
      titleAr: "تشفير البيانات بالكامل",
      desc: "Your data is encrypted using 256-bit SSL technology, ensuring total privacy.",
      descAr: "بياناتك مشفرة باستخدام تقنية SSL 256-bit لضمان الخصوصية التامة.",
    },
    {
      icon: Lock,
      title: "PCI DSS Compliant",
      titleAr: "معايير أمان عالمية",
      desc: "All transactions are processed through certified gateways meeting international standards.",
      descAr:
        "تتم جميع المعاملات من خلال بوابات دفع معتمدة تلتزم بالمعايير الدولية.",
    },
    {
      icon: Smartphone,
      title: "Direct & Fast Payments",
      titleAr: "دفع مباشر وسريع",
      desc: "Official support for InstaPay and Vodafone Cash for immediate secured transfers.",
      descAr:
        "دعم رسمي لخدمات إنستاباي وفودافون كاش لضمان تحويلات آمنة وفورية.",
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
            Secure <span className="font-bold">Payments</span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-(--color-border) max-w-[100px] mx-auto"
          />
        </div>

        <div className="space-y-12">
          {securityFeatures.map((feature, idx) => (
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
          className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              SSL Secure
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              256-Bit AES
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
