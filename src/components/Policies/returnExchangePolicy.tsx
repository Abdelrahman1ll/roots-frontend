import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useGetDeliveryQuery } from "../../redux/Delivery/apiDelivery";

/**
 * ReturnExchangePolicy: Rules for returns, exchanges, and refunds.
 * سياسة الاستبدال والاسترجاع: قواعد الإرجاع والاستبدال واسترداد الأموال.
 */
export default function ReturnExchangePolicy() {
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
            Return & <span className="font-bold">Exchange</span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-(--color-border) max-w-[100px] mx-auto"
          />
        </div>

        <div className="space-y-12">
          {/* Section 1: Overview */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              1. Overview | نظرة عامة
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                We strive for your complete satisfaction. If you are not
                satisfied, you may request a return or exchange according to the
                terms below.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                نحرص على رضاكم الكامل عن مشترياتكم. إذا لم تكن راضيًا عن المنتج،
                يمكنك إرجاعه أو استبداله وفقًا للشروط التالية.
              </p>
            </div>
          </motion.section>

          {/* Section 2: Return Conditions */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              2. Return Conditions | شروط الإرجاع
            </h2>
            <div className="pl-4 border-l border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <ul className="list-disc pl-4 space-y-2 marker:text-gray-300">
                  <li className="text-sm font-medium text-gray-700">
                    Must be within 7 days from receiving the shipment.
                  </li>
                  <li className="text-sm font-medium text-gray-700">
                    Must be in original condition with size tags attached.
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-right" dir="rtl">
                <ul className="list-disc pr-4 space-y-2 marker:text-gray-300">
                  <li className="text-sm font-light text-gray-400">
                    يجب تقديم الطلب خلال 7 أيام من تاريخ الاستلام.
                  </li>
                  <li className="text-sm font-light text-gray-400">
                    أن تكون في حالتها الأصلية ومرفق بها بطاقة المقاس.
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Exchange Rules */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              3. Exchange Rules | سياسة الاستبدال
            </h2>
            <div className="space-y-4 pl-4 border-l border-gray-100">
              <div className="space-y-2">
                <p className="text-base text-gray-700 font-bold">
                  Important: Each shipment is eligible for only one operation
                  (Return OR Exchange).
                </p>
                <p className="text-base text-gray-400 font-light" dir="rtl">
                  تنبيه: يمكن لكل شحنة إجراء عملية واحدة فقط (إما استبدال أو
                  استرجاع).
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-base text-gray-700 leading-relaxed font-medium">
                  Customers are responsible for any additional shipping fees for
                  return or exchange.
                </p>
                <p
                  className="text-base text-gray-400 leading-relaxed font-light"
                  dir="rtl"
                >
                  العميل مسؤول عن أي رسوم شحن إضافية تنشأ عند تنفيذ الاسترجاع أو
                  الاستبدال.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 4: Refund Policy */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              4. Refund Policy | استرداد الأموال
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Methods
                  </p>
                  <p className="text-sm font-bold text-(--color-dark)">
                    InstaPay / Vodafone Cash
                  </p>
                </div>
                <div className="p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Timeframe
                  </p>
                  <p className="text-sm font-bold text-(--color-dark)">
                    Within 14 working days
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start md:items-center mt-4 p-4 bg-gray-50/50">
                <AlertCircle
                  size={16}
                  className="text-gray-400 shrink-0 mt-1 md:mt-0"
                />
                <p className="text-sm font-medium text-gray-600 leading-tight">
                  Refusing the order at the door incurs a{" "}
                  <span className="font-bold">
                    {isLoading ? "..." : deliveryData?.deliveryPriceFar || 80}{" "}
                    EGP
                  </span>{" "}
                  fee.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 5: Damaged Items */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              5. Damaged Items | المنتجات التالفة
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                If the received item is damaged or different, a free exchange is
                offered within 3 days without any extra fees.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                إذا كان المنتج تالفًا أو مختلفًا، نقدم استبدالًا مجانيًا خلال 3
                أيام دون أي رسوم إضافية.
              </p>
            </div>
          </motion.section>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-100 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Dedicated to your satisfaction
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
