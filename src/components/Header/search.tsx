import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function SearchInput({
  setSearch,
  setIsSearchLocal,
}: {
  setSearch: (val: boolean) => void;
  setIsSearchLocal: (val: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialized = useRef(false);
  //   /* ================= Read from URL ================= */
  useEffect(() => {
    const name = searchParams.get("name");

    if (name) {
      setName(name);
    }

    initialized.current = true;
  }, [searchParams]);

  /* ================= Write to URL ================= */
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!initialized.current) return;
      const params = new URLSearchParams(searchParams.toString());

      if (name.length > 0) {
        params.set("name", name);
      } else {
        params.delete("name");
      }

      setSearchParams(params);
    }, 300);

    return () => clearTimeout(handler);
  }, [name, setSearchParams, searchParams]);

  return createPortal(
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="fixed top-0 left-0 w-full bg-white z-200 border-b-2 border-black shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-[1180px]:hidden p-6"
    >
      <div className="relative max-w-7xl mx-auto flex items-center">
        <div className="absolute left-4">
          <Search size={22} className="text-black" strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="SEARCH ARCHIVES..."
          className="w-full pl-14 pr-14 py-6 bg-gray-50/50 text-base font-black tracking-[0.2em] outline-none uppercase placeholder:text-gray-200 border border-transparent focus:border-black/5 transition-all"
          value={name}
          onChange={(e) => {
            const newValue = e.target.value;
            setName(newValue);
            if (
              newValue.length > 0 &&
              window.location.pathname !== "/products"
            ) {
              navigate(`/products?name=${encodeURIComponent(newValue)}`);
            }
          }}
          onFocus={() => {
            localStorage.setItem("isSearch", "true");
            setIsSearchLocal(true);
            setSearch(true);
          }}
          autoFocus
        />
        <button
          className="absolute right-4 p-3 hover:bg-black hover:text-white transition-all rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const params = new URLSearchParams(searchParams.toString());
            params.delete("name");
            setSearchParams(params);
            setName("");

            localStorage.removeItem("isSearch");
            setIsSearchLocal(false);
            setSearch(false);
          }}
        >
          <X size={22} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}
