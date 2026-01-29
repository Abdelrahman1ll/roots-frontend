import { motion } from "framer-motion";

/**
 * TermsConditions: Legal agreement and usage rules.
 * الشروط والأحكام: الاتفاقية القانونية وقواعد الاستخدام.
 */
export default function TermsConditions() {
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
            Terms & <span className="font-bold">Conditions</span>
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
              1. Acceptance of Terms | قبول الشروط
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                By using this website and purchasing its products, you agree to
                comply with these terms and all related policies.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                باستخدامك لهذا الموقع وشراء المنتجات منه، فإنك توافق على
                الالتزام بهذه الشروط والأحكام وجميع السياسات المرتبطة.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              2. User Account | حساب المستخدم
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                All provided information must be accurate and up to date. You
                are responsible for keeping your login data secure.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                يجب أن تكون جميع المعلومات التي تقدمها دقيقة ومحدثة. أنت مسؤول
                عن الحفاظ على سرية بيانات الدخول الخاصة بك.
              </p>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              3. Products & Pricing | المنتجات والأسعار
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                We reserve the right to modify prices and offers at any time
                without prior notice. Displayed images may slightly differ from
                actual products.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                نحتفظ بالحق في تعديل الأسعار والعروض في أي وقت دون إشعار مسبق.
                قد تختلف الصور المعروضة عن المنتجات الفعلية قليلاً.
              </p>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              4. Payment & Delivery | الدفع والتسليم
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                All payments must be made through authorized methods. Delivery
                times are estimated and not guaranteed precisely.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                جميع المدفوعات يجب أن تتم عبر وسائل الدفع المصرح بها. نحن نسعى
                لتسليم المنتجات خلال المدة المحددة، ولكن لا يمكننا ضمان مواعيد
                دقيقة دائمًا.
              </p>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              5. User Responsibility | مسؤولية المستخدم
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                You agree to use the website lawfully and not attempt any
                misuse, hacking, or violation of others' rights.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                أنت توافق على استخدام الموقع بطريقة قانونية وعدم إساءة استخدامه
                أو محاولة اختراقه أو انتهاك حقوق الغير.
              </p>
            </div>
          </motion.section>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-100 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Last Updated: Jan 2026
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
