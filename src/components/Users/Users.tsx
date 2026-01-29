import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Search, Users, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../redux/users/apiUsers";
import type { UserType } from "../../types/UserType";
import { useState } from "react";

/**
 * AllUsers: Administrative interface for viewing and managing the list of registered users.
 * المستخدمين: واجهة إدارية لعرض وإدارة قائمة المستخدمين المسجلين.
 */
export default function AllUsers() {
  const { data: getUsers, isLoading } = useGetUsersQuery({});
  const [searchTerm, setSearchTerm] = useState("");

  const users = Array.isArray(getUsers) ? getUsers : getUsers?.users || [];

  const filteredUsers = users.filter((user: UserType) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--color-tiger-10),transparent),radial-gradient(circle_at_bottom_left,var(--color-pakistan-10),transparent)] flex flex-col items-center py-2 px-4 md:px-8 mt-18 overflow-x-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-(--color-pakistan)/5 border border-(--color-pakistan)/10 text-(--color-pakistan) mb-4">
          <Users size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Administration Panel
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-(--color-pakistan) tracking-tight mb-4">
          User Management
        </h1>
        <p className="text-(--color-pakistan)/60 font-medium max-w-lg mx-auto leading-relaxed">
          Overview of all registered style enthusiasts in your boutique
          community.
        </p>
      </motion.div>

      {/* Search Bar Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl px-4 sm:px-0 mb-8 relative group mx-auto"
      >
        <div className="absolute inset-0 bg-(--color-tiger)/5 blur-2xl -z-10 group-focus-within:bg-(--color-tiger)/10 transition-colors" />
        <div className="relative">
          <input
            type="text"
            placeholder="Filter by email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-14 py-5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-gray-200/20 focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) text-center sm:text-left"
          />
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-(--color-pakistan)/40 transition-colors group-focus-within:text-(--color-tiger)"
            size={22}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Users List */}
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-full h-24 bg-white/40 animate-pulse rounded-3xl"
                />
              ))}
            </motion.div>
          ) : filteredUsers.length > 0 ? (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {filteredUsers.map((user: UserType) => (
                <motion.div
                  key={user.id}
                  className="w-full flex justify-center px-4"
                >
                  <Link
                    to={`/edit-user-owner/${user?.id}`}
                    className="w-full max-w-[420px] sm:max-w-4xl"
                  >
                    <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-4 sm:p-5 rounded-4xl shadow-xl shadow-gray-200/5 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6 hover:shadow-2xl hover:bg-white/80 transition-all duration-300 group overflow-hidden">
                      {/* Left: Icon & User Info */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
                        <div className="w-14 h-14 sm:w-12 sm:h-12 bg-linear-to-br from-(--color-tiger) to-(--color-earth) rounded-2xl flex items-center justify-center text-white shadow-lg shadow-(--color-tiger)/20 transform group-hover:rotate-6 transition-transform shrink-0">
                          <User
                            size={28}
                            className="sm:w-6 sm:h-6"
                            strokeWidth={2.5}
                          />
                        </div>

                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
                          <div className="flex items-center gap-2 justify-center sm:justify-start w-full">
                            <Mail
                              size={12}
                              className="text-(--color-tiger) shrink-0"
                            />
                            <p className="font-black text-(--color-pakistan) tracking-tight break-all line-clamp-1 sm:line-clamp-none max-w-[240px] sm:max-w-none">
                              {user.email}
                            </p>
                          </div>
                          <p className="text-[10px] font-bold text-(--color-pakistan)/40 uppercase tracking-widest mt-1">
                            ID: #{String(user.id).slice(-8)}
                          </p>
                        </div>
                      </div>

                      {/* Right: Date & Arrow */}
                      <div className="flex flex-row sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end pt-4 sm:pt-0 border-t border-white/40 sm:border-none">
                        <div className="flex flex-col items-center sm:items-end">
                          <div className="flex items-center gap-2 text-xs font-black text-(--color-pakistan)/60">
                            <Calendar
                              size={14}
                              className="text-(--color-tiger)/60"
                            />
                            <span>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-(--color-tiger)/40 mt-0.5">
                            Member Since
                          </span>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-(--color-pakistan)/5 flex items-center justify-center text-(--color-pakistan) transform group-hover:translate-x-1 transition-transform shrink-0 ring-4 ring-white/20">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-xl"
            >
              <div className="w-20 h-20 bg-(--color-pakistan)/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-(--color-pakistan)/20">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-black text-(--color-pakistan) mb-2">
                No mirrors matching that style
              </h3>
              <p className="text-(--color-pakistan)/60 font-medium">
                Try searching for a different email address.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 text-xs font-black uppercase tracking-widest text-(--color-tiger) hover:underline"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-12 text-[9px] font-black text-(--color-pakistan)/20 uppercase tracking-[0.4em]">
        Total Boutique Members: {users.length}
      </p>
    </div>
  );
}

const X = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
