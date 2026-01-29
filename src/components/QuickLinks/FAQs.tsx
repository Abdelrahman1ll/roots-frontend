import { motion } from "framer-motion";
import { Package, RotateCcw, CreditCard } from "lucide-react";

/**
 * FAQs: Frequently Asked Questions with modern categorized layout.
 * الأسئلة الشائعة: الأسئلة الأكثر شيوعاً بتصميم عصري مصنف.
 */
export default function FAQs() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const categories = [
    {
      title: "Shipping & Delivery",
      titleAr: "الشحن والتوصيل",
      icon: Package,
      questions: [
        {
          q: "What if I received a wrong item or an item is missing?",
          qAr: "ماذا لو استلمت منتجًا خاطئًا أو مفقودًا؟",
          a: "We urge our customers to check items immediately... Contact us immediately if there's an issue.",
          aAr: "نحث عملائنا على التحقق من المنتجات فور استلامها... اتصل بنا فورًا إذا كان هناك أي خطأ.",
        },
        {
          q: "How long does delivery take?",
          qAr: "كم تستغرق مدة التوصيل؟",
          a: "Delivery takes 3–7 working days across most regions of Egypt.",
          aAr: "مدة التوصيل من 3 إلى 7 أيام عمل في معظم محافظات مصر.",
        },
      ],
    },
    {
      title: "Exchange & Return",
      titleAr: "الاسترجاع والاستبدال",
      icon: RotateCcw,
      questions: [
        {
          q: "Do you offer refunds?",
          qAr: "هل تقدمون استرداد الأموال؟",
          a: "Please contact us for refund policy details.",
          aAr: "يرجى التواصل معنا لمعرفة سياسة الاسترداد.",
        },
        {
          q: "Who pays shipping costs for a refund?",
          qAr: "من يتحمل رسوم الشحن عند الاسترداد؟",
          a: "Customer pays shipping costs when free shipping was applied.",
          aAr: "يتحمل العميل رسوم الشحن في حالة الاسترداد للطلبات المجانية الشحن.",
        },
      ],
    },
    {
      title: "Payments & Orders",
      titleAr: "الدفع والطلبات",
      icon: CreditCard,
      questions: [
        {
          q: "How can I apply the discount code?",
          qAr: "كيف يمكنني استخدام كود الخصم؟",
          a: "Enter your code at checkout under 'Apply Discount Code' and click Apply.",
          aAr: "أدخل كود الخصم عند الدفع تحت 'تطبيق كود الخصم' ثم اضغط تطبيق.",
        },
        {
          q: "I am not comfortable with online orders. What do I do?",
          qAr: "لست مرتاحًا للشراء أونلاين، ماذا أفعل؟",
          a: "We offer Pay on Delivery. Inspect products before accepting.",
          aAr: "نوفر الدفع عند الاستلام. تحقق من المنتج قبل استلامه.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 md:px-10 mt-10 md:mt-12 bg-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-20 space-y-4">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-light text-(--color-dark) tracking-tight uppercase"
          >
            Frequently <span className="font-bold">Asked</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-500 text-sm max-w-md mx-auto"
          >
            Everything you need to know about our services.
          </motion.p>
        </div>

        <div className="space-y-24">
          {categories.map((category, catIdx) => (
            <section key={catIdx} className="space-y-8">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 border-b border-gray-100 pb-4"
              >
                <div className="w-8 h-8 flex items-center justify-center text-(--color-dark)">
                  <category.icon size={20} strokeWidth={1.5} />
                </div>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
                    {category.title}
                  </h2>
                  <span className="text-sm text-gray-400" dir="rtl">
                    {category.titleAr}
                  </span>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {category.questions.map((faq, faqIdx) => (
                  <motion.div
                    key={faqIdx}
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <p className="text-base font-bold text-(--color-dark)">
                        {faq.q}
                      </p>
                      <p className="text-sm text-gray-400" dir="rtl">
                        {faq.qAr}
                      </p>
                    </div>

                    <div className="pl-4 border-l border-gray-100 space-y-2">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                      <p
                        className="text-sm text-gray-400 leading-relaxed"
                        dir="rtl"
                      >
                        {faq.aAr}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Brand Sign-off */}
        <motion.div
          variants={itemVariants}
          className="mt-24 pt-12 border-t border-gray-100 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            Help Center © 2026
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
