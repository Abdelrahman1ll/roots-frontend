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
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
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
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 md:px-8 mt-18 overflow-x-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-left mb-16 border-b border-(--color-border) pb-8"
      >
        <div className="flex items-center gap-3 text-(--color-pakistan) mb-6">
          <Users size={20} />
          <span className="text-[10px] font-black tracking-widest">
            Administration Panel
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-(--color-dark) tracking-tighter mb-4">
          User Management
        </h1>
        <p className="text-(--color-pakistan) font-bold tracking-widest uppercase text-[10px] opacity-60">
          Complete overview of your boutique community and member database.
        </p>
      </motion.div>

      {/* Search Bar Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl mb-12 relative"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Filter by email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-16 py-6 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-bold text-(--color-dark) text-sm tracking-widest placeholder:text-gray-300"
          />
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-(--color-dark)"
            size={20}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 transition-colors"
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
                  className="w-full h-24 bg-gray-50 animate-pulse rounded-none border border-(--color-border)"
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
                <motion.div key={user.id} className="w-full">
                  <Link
                    to={`/edit-user-owner/${user?.id}`}
                    className="block w-full"
                  >
                    <div className="bg-white border border-(--color-border) p-6 rounded-none flex flex-col sm:flex-row items-center sm:justify-between gap-6 hover:border-(--color-dark) transition-all duration-300 group relative">
                      {/* Left: Icon & User Info */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                        <div className="w-12 h-12 bg-(--color-gray-soft) rounded-none flex items-center justify-center text-(--color-dark) group-hover:bg-(--color-dark) group-hover:text-white transition-colors">
                          <User size={20} strokeWidth={2.5} />
                        </div>

                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
                          <div className="flex items-center gap-2 justify-center sm:justify-start w-full">
                            <Mail
                              size={12}
                              className="text-(--color-pakistan) opacity-40 shrink-0"
                            />
                            <p className="font-black text-(--color-dark) tracking-tight text-sm">
                              {user.email}
                            </p>
                          </div>
                          <p className="text-[10px] font-bold text-(--color-pakistan) opacity-40 uppercase tracking-widest mt-1">
                            ID: #{String(user.id).slice(-8)}
                          </p>
                        </div>
                      </div>

                      {/* Right: Date & Role (simplified) */}
                      <div className="flex flex-row items-center gap-8 w-full sm:w-auto justify-center sm:justify-end pt-4 sm:pt-0 border-t sm:border-none border-gray-100 text-(--color-dark)">
                        <div className="flex flex-col items-center sm:items-end">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Calendar size={14} className="opacity-40" />
                            <span>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold tracking-widest text-(--color-pakistan) opacity-40 mt-1">
                            Joined
                          </span>
                        </div>

                        <div className="w-10 h-10 rounded-none bg-(--color-gray-soft) flex items-center justify-center group-hover:bg-(--color-dark) group-hover:text-white transition-all">
                          <ArrowRight size={18} />
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white rounded-none border border-(--color-border)"
            >
              <div className="w-16 h-16 bg-(--color-gray-soft) rounded-none flex items-center justify-center mx-auto mb-8 text-(--color-dark)">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-black text-(--color-dark) tracking-tighter mb-2">
                No members found
              </h3>
              <p className="text-(--color-pakistan) font-bold text-[10px] uppercase tracking-widest opacity-40">
                Try searching for a different email address.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-8 text-[10px] font-black tracking-widest text-(--color-dark) hover:opacity-60 transition-opacity border-b border-black pb-1"
              >
                RESET SEARCH
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-16 text-[9px] font-black text-(--color-pakistan) opacity-20 tracking-widest">
        Total Members: {users.length}
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
