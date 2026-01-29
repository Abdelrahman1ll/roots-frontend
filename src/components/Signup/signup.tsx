import { X } from "lucide-react";
import useSignup from "./useSignup";
import GoogleSignup from "./googleSignup";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/**
 * Signup: User registration modal with email verification and Google login.
 * التسجيل: نافذة تسجيل المستخدم مع التحقق من البريد الإلكتروني وتسجيل جوجل.
 */
export default function Signup({ onClose }: { onClose: () => void }) {
  const {
    email,
    setEmail,
    showCodeInput,
    code,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleVerifyCode,
    handleSignup,
    isLoading,
    isLoadingUser,
  } = useSignup(onClose as () => void);

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const formVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50 p-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative p-10 sm:p-16 shadow-2xl max-w-lg w-full text-center bg-white border border-gray-100"
      >
        <motion.button
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-(--color-dark) transition-colors cursor-pointer"
          title="Close"
        >
          <X size={24} strokeWidth={1.5} />
        </motion.button>

        <AnimatePresence mode="wait">
          {!showCodeInput ? (
            <motion.div
              key="signup-form"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <form className="text-left" onSubmit={handleSignup}>
                <h2 className="text-3xl font-light text-center mb-4 text-(--color-dark) uppercase tracking-tighter">
                  Member Access
                </h2>
                <div className="w-12 h-px bg-(--color-dark)/20 mx-auto mb-8" />
                <p className="text-[10px] font-bold text-center mb-10 text-(--color-dark)/40 uppercase tracking-[0.4em]">
                  Join the ROOTS Archive
                </p>

                <div className="space-y-8">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[9px] font-black mb-3 ml-1 text-(--color-dark)/30 uppercase tracking-[0.2em]"
                    >
                      Electronic Mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-0 py-4 border-b border-gray-100 focus:border-(--color-dark) transition-colors outline-none text-(--color-dark) bg-white font-bold"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <AnimatePresence>
                      {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                        email.length > 0 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 ml-1"
                          >
                            Internal verification failed: Invalid format
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </div>

                  <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] leading-relaxed px-1">
                    An encrypted 6-digit verification code will be dispatched to
                    your inbox.
                  </p>

                  <motion.button
                    whileHover={!isLoading ? { backgroundColor: "#000" } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={!email || isLoading}
                    className={`w-full py-5 font-black text-white shadow-none transition-all flex items-center justify-center uppercase tracking-[0.4em] text-xs
                    ${
                      isLoading
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-(--color-dark) cursor-pointer"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Dispatch Code"
                    )}
                  </motion.button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]">
                      <span className="bg-white px-4 text-gray-300">
                        Universal Protocol
                      </span>
                    </div>
                  </div>

                  <GoogleSignup onClose={onClose} />
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="verify-form"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <form className="text-left" onSubmit={handleVerifyCode}>
                <h2 className="text-3xl font-light text-center mb-4 text-(--color-dark) uppercase tracking-tighter">
                  Verification
                </h2>
                <div className="w-12 h-px bg-(--color-dark)/20 mx-auto mb-8" />
                <p className="text-[10px] font-bold text-center mb-10 text-(--color-dark)/40 uppercase tracking-[0.4em]">
                  Dispatched to {email}
                </p>

                <div className="space-y-10">
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-[9px] font-black mb-6 text-center text-(--color-dark)/30 uppercase tracking-[0.3em]"
                    >
                      Enter 6-digit protocol code
                    </label>

                    <div className="flex gap-3 justify-center mb-4">
                      {code.map((digit, i) => (
                        <motion.input
                          key={i}
                          id={`code-${i}`}
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          autoComplete="one-time-code"
                          value={digit}
                          onChange={(e) => handleChange(e, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          onPaste={handlePaste}
                          className="w-12 h-16 text-center text-2xl font-light border-b border-gray-100 focus:border-(--color-dark) outline-none transition-all bg-white text-(--color-dark)"
                        />
                      ))}
                    </div>

                    <AnimatePresence>
                      {!/^\d{6}$/.test(code.join("")) &&
                        code.join("").length !== 0 &&
                        code.join("").length !== 6 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center mt-4"
                          >
                            Sequence identification failed
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={
                      !isLoadingUser ? { backgroundColor: "#000" } : {}
                    }
                    whileTap={!isLoadingUser ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={code.join("").length !== 6 || isLoadingUser}
                    className={`w-full py-5 font-black text-white shadow-none transition-all flex items-center justify-center uppercase tracking-[0.4em] text-xs
                    ${
                      isLoadingUser
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-(--color-dark) cursor-pointer"
                    }`}
                  >
                    {isLoadingUser ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Sync Archive"
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="w-full text-[8px] font-black text-gray-300 hover:text-(--color-dark) transition-colors text-center uppercase tracking-[0.3em]"
                  >
                    Resend authentication request
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
