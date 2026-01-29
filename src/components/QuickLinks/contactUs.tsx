import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { BRAND_EMAIL, BRAND_PHONE } from "../../BrandText";

/**
 * ContactUs: Form and information for user inquiries and support.
 * اتصل بنا: نموذج ومعلومات لاستفسارات المستخدمين والدعم.
 */
export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [state, handleSubmit] = useForm("xldzgwvb");

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-10 mt-10 md:mt-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 lg:gap-24"
      >
        {/* Left Column: Contact Information */}
        <div className="flex-1 space-y-12 py-6">
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-7xl font-light text-(--color-dark) tracking-tight uppercase"
            >
              Contact
              <br />
              <span className="font-bold">Us</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 font-bold text-xs max-w-md leading-relaxed uppercase tracking-widest"
            >
              We're here to help. Reach out to us for any inquiries or support.
            </motion.p>
          </div>

          <div className="space-y-4">
            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6 p-6 border border-gray-100 transition-all group hover:border-(--color-dark)"
            >
              <div className="w-10 h-10 flex items-center justify-center text-(--color-dark)">
                <Phone size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">
                  Phone
                </p>
                <p className="text-lg font-bold text-(--color-dark) tracking-tight">
                  {BRAND_PHONE}
                </p>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 p-6 border border-gray-100 transition-all group hover:border-(--color-dark)"
            >
              <div className="w-10 h-10 flex items-center justify-center text-(--color-dark)">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">
                  Email
                </p>
                <p className="text-lg font-bold text-(--color-dark) tracking-tight break-all">
                  {BRAND_EMAIL}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-6 pt-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
              Follow Us
            </span>
            <div className="h-px w-8 bg-gray-100" />
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="w-8 h-8 flex items-center justify-center text-(--color-dark) hover:text-black transition-all"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Minimal Form Container */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 border border-(--color-border) h-full flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              {state.succeeded ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center space-y-8 py-20"
                >
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center">
                    <CheckCircle2 size={24} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-(--color-dark) uppercase tracking-widest">
                      Message Sent
                    </h3>
                    <p className="text-gray-400 font-medium text-xs leading-relaxed">
                      Thank you for contacting us. We will get back to you
                      shortly.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h3 className="text-lg font-bold text-(--color-dark) mb-12 uppercase tracking-widest">
                    Send a Message
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-0 py-3 border-b border-gray-200 focus:border-black transition-colors outline-none font-medium text-(--color-dark) rounded-none bg-transparent"
                      />
                      <ValidationError
                        prefix="Name"
                        field="name"
                        errors={state.errors}
                        className="text-[9px] font-bold text-red-500 uppercase tracking-widest"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-0 py-3 border-b border-gray-200 focus:border-black transition-colors outline-none font-medium text-(--color-dark) rounded-none bg-transparent"
                      />
                      <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        className="text-[9px] font-bold text-red-500 uppercase tracking-widest"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-0 py-3 border-b border-gray-200 focus:border-black transition-colors outline-none font-medium text-(--color-dark) rounded-none bg-transparent resize-none"
                      />
                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="text-[9px] font-bold text-red-500 uppercase tracking-widest"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="group w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-5 transition-all hover:bg-gray-900 disabled:opacity-50 text-xs flex items-center justify-center gap-3 mt-4"
                    >
                      {state.submitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <Send
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
