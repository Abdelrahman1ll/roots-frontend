import { motion } from "framer-motion";
/**
 * PrivacyPolicy: Data protection and privacy rules.
 * سياسة الخصوصية: حماية البيانات وقواعد الخصوصية.
 */
export default function PrivacyPolicy() {
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
            Privacy <span className="font-bold">Policy</span>
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
              1. Information Collection | جمع المعلومات
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                We collect information you provide when registering, purchasing,
                or contacting us, including name, email, phone number, and
                shipping address.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                نحن نجمع المعلومات التي تقدمها لنا عند التسجيل أو إجراء عملية
                شراء أو التواصل معنا، بما في ذلك الاسم، البريد الإلكتروني، رقم
                الهاتف، وعنوان الشحن.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              2. Use of Information | استخدام المعلومات
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                We use the information to improve our services, process orders,
                communicate with customers, and send offers and updates.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                نستخدم المعلومات لتحسين خدماتنا، معالجة الطلبات، التواصل مع
                العملاء، وإرسال العروض والتحديثات المتعلقة بالمنتجات والخدمات.
              </p>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              3. Data Protection | حماية المعلومات
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                We implement appropriate security measures to protect your
                personal data from unauthorized access or disclosure.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                نحن نتخذ التدابير الأمنية المناسبة لحماية معلوماتك الشخصية من
                الوصول غير المصرح به أو الاستخدام أو الكشف.
              </p>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--color-dark)">
              4. Sharing Information | مشاركة المعلومات
            </h2>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                We do not share your personal data with third parties for
                marketing without your consent, except with trusted partners for
                order processing and delivery.
              </p>
              <p
                className="text-base text-gray-400 leading-relaxed font-light"
                dir="rtl"
              >
                لن نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية دون
                موافقتك، وقد نشاركها فقط مع شركائنا الموثوق بهم لأغراض معالجة
                الطلبات والشحن.
              </p>
            </div>
          </motion.section>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-100 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Secure & Encrypted Experience
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
