import { motion } from "framer-motion";

/**
 * SalesPaymentPolicy: Terms for sales transactions and payment security.
 * سياسة البيع والدفع: شروط عمليات البيع وأمن الدفع.
 */
export default function SalesPaymentPolicy() {
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
            Sales & <span className="font-bold">Payment</span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-(--color-border) max-w-[100px] mx-auto"
          />
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              1. Overview | نظرة عامة
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                This policy outlines the terms related to sales and payment when
                purchasing from our boutique.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                توضح هذه السياسة الشروط المتعلقة بعمليات البيع والدفع عند الشراء
                من متجرنا.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              2. Prices & Offers | الأسعار والعروض
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                Prices are displayed in local currency (EGP) and may include
                applicable taxes. Offers are subject to availability.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                الأسعار معروضة بالعملة المحلية وقد تشمل الضرائب المطبقة. العروض
                تخضع للتوفر وقد تكون لفترة محدودة.
              </p>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              3. Payment Methods | طرق الدفع
            </h2>
            <div className="pl-4 border-l border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Bank Cards",
                "Cash on Delivery",
                "InstaPay",
                "Vodafone Cash",
              ].map((method, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50/50 p-4 border border-gray-100 text-center"
                >
                  <p className="text-[10px] font-bold uppercase text-(--color-dark) tracking-widest">
                    {method}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              4. Order Confirmation | تأكيد الطلب
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                You can view your order details, including status and payment
                method, directly from your Order page on the website.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                يمكنك عرض تفاصيل طلبك، بما في ذلك الحالة وطريقة الدفع، مباشرة من
                صفحة الطلب في الموقع.
              </p>
            </div>
          </motion.section>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-100 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Secure & Trusted Transactions
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
