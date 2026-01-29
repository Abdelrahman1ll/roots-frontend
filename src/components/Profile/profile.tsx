import { motion, AnimatePresence } from "framer-motion";
import { Gift, BadgeCheck } from "lucide-react";
import useProfile from "./useProfile";

export default function Profile() {
  const {
    userData,
    handleChange,
    handleSave,
    progress,
    errors,
    isLoading,
    rewardVisible,
    reward,
  } = useProfile();

  return (
    <div className="min-h-screen bg-white p-4 md:p-12 flex items-start justify-center pt-24 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white border border-gray-100 overflow-hidden"
      >
        {/* Header Section - Minimal */}
        <div className="bg-(--color-dark) p-6 md:p-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight flex items-center justify-center gap-4 uppercase">
              {userData.firstName
                ? `${userData.firstName} ${userData.lastName}`
                : "My Archive"}
              {progress === 100 && (
                <BadgeCheck className="text-white opacity-60" size={28} />
              )}
            </h2>
          </div>
          <div className="w-12 h-px bg-white/20 mb-4" />
          <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[9px]">
            Member Account Details
          </p>
        </div>

        <div className="p-8 md:p-16">
          {/* Progress Bar - Slim & High Contrast */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black text-(--color-dark) uppercase tracking-[0.3em]">
                Profile Integrity
              </span>
              <span className="text-sm font-black text-(--color-dark)">
                {progress}%
              </span>
            </div>
            <div className="relative h-px w-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="absolute inset-y-0 left-0 bg-(--color-dark)"
              />
            </div>

            <AnimatePresence>
              {rewardVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-12 bg-gray-50 p-8 flex items-start gap-6 border border-gray-100"
                >
                  <div className="p-3 bg-(--color-dark) text-white">
                    <Gift size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-(--color-dark) text-xl uppercase tracking-wider">
                      Curation Reward
                    </h4>
                    <p className="text-(--color-dark)/50 text-sm mt-2 leading-relaxed font-medium">
                      Your profile is complete. Enjoy a{" "}
                      <span className="text-(--color-dark) font-black">
                        {reward?.discount}% archive discount
                      </span>{" "}
                      with code:
                      <span className="mx-2 inline-block px-3 py-1 bg-white border border-gray-100 text-(--color-dark) font-mono font-bold tracking-widest text-lg">
                        {reward?.code}
                      </span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSave} className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
              {/* Personal Info */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                  <h3 className="text-base font-black text-(--color-dark) uppercase tracking-[0.3em]">
                    Identification
                  </h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-(--color-dark)/30 uppercase tracking-[0.2em]">
                      Given Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-0 py-4 border-b border-gray-100 focus:border-(--color-dark) transition-colors outline-none font-bold text-(--color-dark) text-base placeholder:text-gray-200"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-(--color-dark)/30 uppercase tracking-[0.2em]">
                      Family Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-0 py-4 border-b border-gray-100 focus:border-(--color-dark) transition-colors outline-none font-bold text-(--color-dark) text-base placeholder:text-gray-200"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-(--color-dark)/30 uppercase tracking-[0.2em]">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={
                        userData.birthday ? userData.birthday.split("T")[0] : ""
                      }
                      onChange={handleChange}
                      className="w-full px-0 py-4 border-b border-gray-100 focus:border-(--color-dark) transition-colors outline-none font-bold text-(--color-dark) text-base appearance-none"
                    />
                    {errors.birthday && (
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2">
                        {errors.birthday}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                  <h3 className="text-base font-black text-(--color-dark) uppercase tracking-[0.3em]">
                    Communication
                  </h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-(--color-dark)/30 uppercase tracking-[0.2em]">
                      Archived Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="w-full px-0 py-4 border-b border-gray-50 text-(--color-dark)/30 font-bold cursor-not-allowed text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-(--color-dark)/30 uppercase tracking-[0.2em]">
                      Verified Mobile
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      placeholder="+20 000 000 0000"
                      className="w-full px-0 py-4 border-b border-gray-100 focus:border-(--color-dark) transition-colors outline-none font-bold text-(--color-dark) text-base placeholder:text-gray-200"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-12 flex flex-col items-center gap-6">
              <motion.button
                whileHover={!isLoading ? { backgroundColor: "#000" } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
                type="submit"
                className="w-full max-w-md bg-(--color-dark) text-white font-black uppercase tracking-[0.4em] py-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs shadow-none border-none outline-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  "Universal Sync"
                )}
              </motion.button>
              <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.5em]">
                Secured Encryption Protocol 2026
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
