import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  ShoppingBag,
  LayoutDashboard,
  Users,
  Plus,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function UserMenu({
  handleLogout,
}: {
  handleLogout: () => void;
}) {
  const { user } = useContext(AuthContext);
  const avatarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);

  // إغلاق القائمة عند الضغط خارجها أو عند التمرير
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenu &&
        menuRef.current &&
        avatarRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const menuVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.2,
        ease: "easeOut",
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      filter: "blur(4px)",
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const menuItems = [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/orders", label: "My Orders", icon: ShoppingBag },
  ];

  const adminItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/all-users", label: "All Users", icon: Users },
    { to: "/add-product", label: "Add Product", icon: Plus },
    { to: "/category", label: "Add Category", icon: Plus },
    { to: "/color", label: "Add Color", icon: Plus },
    { to: "/add-delivery", label: "Add Delivery", icon: Plus },
    { to: "/discount-codes", label: "Discount Codes", icon: Plus },
    { to: "/all-users-messages", label: "Send Message All...", icon: Plus },
    { to: "/email-order-dispatcher", label: "Email Order", icon: Plus },
  ];

  return (
    <div className="relative">
      {/* زر الـ avatar */}
      <motion.div
        className="w-10 h-10 flex items-center justify-center rounded-full bg-(--color-dark) text-white cursor-pointer select-none overflow-hidden transition-all duration-300"
        onClick={() => setOpenMenu(!openMenu)}
        ref={avatarRef}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm font-bold uppercase tracking-tighter">
          {user?.email?.charAt(0) || "U"}
        </span>
      </motion.div>

      {/* القائمة المنسدلة */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 w-64 bg-white text-(--color-pakistan) shadow-xl rounded-xl overflow-hidden border border-(--color-border) z-50 p-1.5
                  max-[1180px]:fixed max-[1180px]:bottom-[4.8rem] max-[1180px]:right-4 max-[1180px]:w-[calc(100%-2rem)] max-[1180px]:max-w-xs max-[1180px]:top-auto max-[1180px]:mt-0
                  min-[1180px]:mt-4 min-[1180px]:top-full
              "
          >
            <div className="py-4 px-5 mb-1 bg-(--color-gray-soft) rounded-lg">
              <p className="text-[9px] font-bold uppercase text-(--color-dark)/40 tracking-[0.2em] leading-none mb-2">
                Logged in as
              </p>
              <p className="text-sm font-bold truncate text-(--color-dark)">
                {user?.email || "User"}
              </p>
            </div>

            <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto px-1 scrollbar-hide">
              {menuItems.map((item) => (
                <motion.div key={item.to} variants={itemVariants}>
                  <Link
                    to={item.to}
                    className="group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 hover:bg-(--color-tiger) hover:text-white"
                    onClick={() => setOpenMenu(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-(--color-tiger)/10 group-hover:bg-white/20 transition-colors">
                        <item.icon
                          size={16}
                          className="text-(--color-tiger) group-hover:text-white"
                        />
                      </div>
                      <span className="font-semibold text-sm">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {user?.role === "owner" && (
                <div className="mt-1 pt-1 border-t border-(--color-tiger)/10 flex flex-col gap-0.5">
                  <p className="px-3 py-1 text-[10px] font-black uppercase text-(--color-tiger)/40 tracking-widest">
                    Admin Actions
                  </p>
                  {adminItems.map((item) => (
                    <motion.div key={item.to} variants={itemVariants}>
                      <Link
                        to={item.to}
                        className="group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 hover:bg-(--color-tiger) hover:text-white"
                        onClick={() => setOpenMenu(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-(--color-tiger)/10 group-hover:bg-white/20 transition-colors">
                            <item.icon
                              size={16}
                              className="text-(--color-tiger) group-hover:text-white"
                            />
                          </div>
                          <span className="font-semibold text-sm">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <motion.div
              variants={itemVariants}
              className="mt-1 pt-1 border-t border-(--color-border)"
            >
              <button
                onClick={() => {
                  handleLogout();
                  setOpenMenu(false);
                }}
                className="w-full group flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 hover:bg-red-50 text-red-600 font-bold"
              >
                <LogOut size={16} />
                <span className="text-xs uppercase tracking-widest">
                  Log Out
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
