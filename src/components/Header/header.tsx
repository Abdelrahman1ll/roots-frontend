import { motion } from "framer-motion";
import {
  ShoppingCart,
  User,
  Search,
  X,
  Menu,
  House,
  Heart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SearchInput from "./search";
import useHeader from "./useHeader";
import { BRAND_NAME } from "../../BrandText";
import UserMenu from "./UserMenu";
import { useUI } from "../../context/UIContext";

/**
 * Header Component: Main navigation bar for desktop and mobile.
 * مكون الترويسة: شريط التنقل الرئيسي للحاسوب والهاتف.
 */
export default function Header() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isSearch,
    setSearch,
    nameInput,
    setNameInput,
    handleLogout,
    user,
    totalItems,
    openSignup,
    isSearchLocal,
    navigate,
    setIsSearchLocal,
  } = useHeader();
  const { toggleCart } = useUI();
  const location = useLocation();

  return (
    <>
      {/* Desktop Header | ترويسة الحاسوب */}
      <header className="sticky top-0 left-0 w-full z-50 bg-white border-b border-(--color-border) py-5 px-8 max-[1180px]:hidden">
        <div className="w-full flex items-center justify-between gap-12 max-w-[1920px] mx-auto">
          {/* Logo Section */}
          <Link to="/" className="flex-initial">
            <span
              className="text-2xl font-bold tracking-[0.25em] cursor-pointer text-(--color-dark)"
              style={{
                fontFamily: "'Inter', sans-serif",
                textTransform: "uppercase",
              }}
            >
              {BRAND_NAME}
            </span>
          </Link>

          {/* Navigation Section - Centered */}
          <nav className="flex-1 flex items-center justify-center gap-10 font-medium whitespace-nowrap">
            <Link
              to="/"
              className="text-(--color-dark) hover:opacity-100 opacity-60 text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-(--color-dark) hover:opacity-100 opacity-60 text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300"
            >
              Collection
            </Link>
            <Link
              to="/about-us"
              className="text-(--color-dark) hover:opacity-100 opacity-60 text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300"
            >
              About
            </Link>
            <Link
              to="/contact-us"
              className="text-(--color-dark) hover:opacity-100 opacity-60 text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300"
            >
              Contact
            </Link>
            <Link
              to="/faqs"
              className="text-(--color-dark) hover:opacity-100 opacity-60 text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300"
            >
              FAQs
            </Link>
          </nav>

          {/* Icons/Action Section */}
          <div className="flex items-center gap-10">
            <div className="relative group">
              <input
                type="text"
                placeholder="SEARCH"
                className="w-32 pl-0 pr-6 py-1 text-[10px] font-bold tracking-widest bg-transparent border-b border-transparent focus:border-(--color-dark) transition-all duration-300 outline-none uppercase placeholder:text-(--color-dark)/30"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onFocus={() => {
                  if (location.pathname !== "/products") {
                    navigate("/products");
                  }
                }}
              />
              <Search
                className="absolute right-0 top-1/2 -translate-y-1/2 text-(--color-dark) group-focus-within:opacity-100 opacity-50 transition-opacity"
                size={14}
                strokeWidth={2.5}
              />
            </div>
            {/* Desktop Icons */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link
                  to="/wishlist"
                  className="w-10 h-10 bg-(--color-gray-soft) rounded-full flex items-center justify-center hover:bg-(--color-gray-medium) transition-all duration-300 group relative"
                  aria-label="View Wishlist"
                >
                  <Heart
                    size={16}
                    strokeWidth={2}
                    className="text-(--color-dark) opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </Link>

                <button
                  onClick={toggleCart}
                  className="w-10 h-10 bg-(--color-gray-soft) rounded-full flex items-center justify-center hover:bg-(--color-gray-medium) transition-all duration-300 group relative"
                  aria-label={`View Shopping Cart, ${totalItems} items`}
                >
                  <ShoppingCart
                    size={16}
                    strokeWidth={2}
                    className="text-(--color-dark) opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-dark) text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {user ? (
                <UserMenu handleLogout={handleLogout} />
              ) : (
                <button
                  className="w-10 h-10 bg-(--color-dark) rounded-full flex items-center justify-center hover:bg-black transition-all duration-300 group shadow-sm"
                  onClick={() => openSignup()}
                  aria-label="Login"
                >
                  <User
                    size={16}
                    strokeWidth={2}
                    className="text-white opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-40 bg-white border-b border-(--color-border) py-5 px-8 min-[1180px]:hidden">
        <div className="w-full flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full hover:bg-black/5 text-[--color-dark]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X size={28} aria-label="Close menu" />
            ) : (
              <Menu size={28} aria-label="Open menu" />
            )}
          </motion.button>

          {isMenuOpen && (
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 w-full h-full backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-200 flex flex-col p-8 border-r border-(--color-border)"
              >
                <div className="mb-8 mt-6 flex justify-between items-center">
                  <span
                    className="text-2xl font-bold tracking-widest text-(--color-dark)"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      textTransform: "uppercase",
                    }}
                  >
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-black/5 rounded-full text-(--color-dark)"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex flex-col mt-4 gap-8 overflow-y-auto max-h-[70vh] pb-10 scrollbar-hide">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] mb-4 px-2">
                      Main
                    </p>
                    {[
                      { to: "/", label: "Home" },
                      { to: "/products", label: "Collection" },
                      { to: "/about-us", label: "About" },
                      { to: "/contact-us", label: "Contact" },
                    ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="py-3 px-2 text-sm font-bold tracking-widest uppercase text-(--color-dark) transition-all hover:pl-4 hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] mb-4 px-2">
                      Support
                    </p>
                    {[
                      { to: "/faqs", label: "FAQs" },
                      { to: "/shipping-delivery", label: "Shipping" },
                      { to: "/shipping-in-egypt", label: "Shipping in Egypt" },
                      { to: "/secure-payment", label: "Secure Payment" },
                    ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="py-3 px-2 text-sm font-bold tracking-widest uppercase text-(--color-dark) transition-all hover:pl-4 hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] mb-4 px-2">
                      Legal
                    </p>
                    {[
                      { to: "/terms-conditions", label: "Terms & Conditions" },
                      { to: "/privacy-policy", label: "Privacy Policy" },
                      {
                        to: "/return-exchange-policy",
                        label: "Returns & Exchange",
                      },
                      {
                        to: "/sales-payment-policy",
                        label: "Sales & Payment",
                      },
                    ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="py-3 px-2 text-[11px] font-bold tracking-widest uppercase text-gray-500 transition-all hover:pl-4 hover:text-(--color-dark) hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </motion.div>
            </div>
          )}

          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <span
              className="text-2xl font-medium tracking-[0.2em] cursor-pointer text-(--color-dark)"
              style={{
                fontFamily: "'Inter', sans-serif",
                textTransform: "uppercase",
              }}
            >
              {BRAND_NAME}
            </span>
          </Link>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full hover:bg-black/5 text-[--color-dark]"
            onClick={() => {
              setSearch(!isSearch);
              setIsSearchLocal(!isSearchLocal);
              localStorage.removeItem("isSearch");
            }}
            aria-label={isSearch ? "Close search" : "Open search"}
          >
            {isSearch ? <X size={28} /> : <Search size={26} strokeWidth={2} />}
          </motion.button>
        </div>
      </header>

      {/* Floating Bottom Mobile Header | ترويسة الهاتف العائمة السفلية */}
      <header
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 
             flex items-center justify-between border border-(--color-border) py-2 px-6 rounded-2xl w-[90%] max-w-sm
             bg-white/95 backdrop-blur-md shadow-xl min-[1180px]:hidden"
      >
        <motion.div whileTap={{ scale: 0.9 }}>
          <Link
            to="/"
            className="block p-2 rounded-lg text-(--color-dark)/70 hover:text-(--color-dark)"
            title="Home"
          >
            <House size={20} strokeWidth={2} />
          </Link>
        </motion.div>

        <motion.div whileTap={{ scale: 0.9 }}>
          <div
            className={`p-2 rounded-lg transition-all ${
              isSearch
                ? "text-(--color-dark)"
                : "text-(--color-dark)/70 hover:text-(--color-dark)"
            }`}
            onClick={() => {
              setSearch(!isSearch);
              setIsSearchLocal(!isSearchLocal);
              localStorage.removeItem("isSearch");
            }}
            role="button"
            aria-label={isSearch ? "Close search" : "Open search"}
            tabIndex={0}
          >
            {isSearch ? (
              <X size={20} strokeWidth={2} />
            ) : (
              <Search size={20} strokeWidth={2} />
            )}
          </div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.9 }}>
          <Link
            to="/wishlist"
            className="block p-2 rounded-lg text-(--color-dark)/70 hover:text-(--color-dark)"
            title="Wishlist"
          >
            <Heart size={20} strokeWidth={2} />
          </Link>
        </motion.div>

        <motion.div whileTap={{ scale: 0.9 }}>
          <button
            onClick={toggleCart}
            className="block p-2 rounded-lg relative text-(--color-dark)/70 hover:text-(--color-dark)"
            title="Cart"
          >
            <ShoppingCart size={20} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full bg-(--color-dark) ring-1 ring-white">
                {totalItems}
              </span>
            )}
          </button>
        </motion.div>

        {user ? (
          <UserMenu handleLogout={handleLogout} />
        ) : (
          <motion.div whileTap={{ scale: 0.9 }}>
            <div
              className="p-2 rounded-lg text-(--color-dark)/70 hover:text-(--color-dark) cursor-pointer"
              title="Login"
              onClick={() => openSignup()}
              role="button"
              aria-label="Login"
              tabIndex={0}
            >
              <User size={20} strokeWidth={2} />
            </div>
          </motion.div>
        )}
      </header>

      {(isSearch || isSearchLocal) && (
        <SearchInput
          setSearch={setSearch}
          setIsSearchLocal={setIsSearchLocal}
        />
      )}
    </>
  );
}
