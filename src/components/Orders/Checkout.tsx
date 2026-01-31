import { useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Loader2,
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  ShoppingCart,
  ChevronDown,
  Info,
  ShieldCheck,
  Tag,
  MapPin,
} from "lucide-react";
import type { CartItemType } from "../../types/CartType";
import useCheckout from "./useCheckout";
import { BRAND_PHONE } from "../../BrandText";
import PaymobPayment from "./PaymobPayment";
import { Link } from "react-router-dom";
/**
 * Checkout: Multi-step process for shipping info, payment, and order completion.
 * الدفع: عملية متعددة الخطوات لبيانات الشحن والدفع وإتمام الطلب.
 */
export default function Checkout() {
  const {
    discount,
    errorMsg,
    openSection,
    errors,
    applyDiscount,
    handleSelectMethod,
    handlePayment,
    deliveryFee,
    finalTotal,
    setPromoCode,
    isLoading,
    orderLoading,
    paymentMethod,
    promoCode,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    state,
    setState,
    addressDetails,
    setAddressDetails,
    phone1,
    setPhone1,
    phone2,
    setPhone2,
    data,
    setErrors,
    navigate,
    isFirstOrder,
    filteredStates,
    setSearch,
    setIsDropdownOpen,
    isDropdownOpen,
    search,
    saveAddress,
    setSaveAddress,
    email,
    isCardValid,
    setIsCardValid,
    setIsPaying,
    isPaying,
    payRef,
    isDetectingLocation,
    handleAutoLocation,
    rawDeliveryFee,
    freeDelivery,
    isOrderCompleted,
  } = useCheckout();

  /**
   * Automatically redirects the user to the cart page if the cart becomes empty.
   * يقوم تلقائياً بتوجيه المستخدم لصفحة السلة إذا أصبحت السلة فارغة.
   */
  useEffect(() => {
    if (!isLoading && !isOrderCompleted && data?.carts?.items.length === 0) {
      navigate("/cart");
    }
  }, [data, isLoading, navigate, isOrderCompleted]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardClasses =
    "p-6 md:p-8 rounded-none border border-gray-100 bg-white transition-all duration-300";
  const labelClasses =
    "block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 text-gray-400";
  const inputClasses =
    "w-full px-5 py-4 rounded-none border border-gray-100 focus:border-black transition-all outline-none text-black bg-gray-50/50 placeholder:text-gray-200 text-xs font-black tracking-widest";

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 mb-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <ShieldCheck size={12} /> Secure Protocol
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">
            Checkout
          </h1>
          <div className="h-1 w-12 bg-black mx-auto mt-6" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start"
        >
          {/* Main Form Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Address Card */}
            <motion.div variants={itemVariants} className={cardClasses}>
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                <div className="text-black">
                  <Truck size={20} />
                </div>
                <h2 className="text-xl font-black text-black uppercase tracking-tighter">
                  Shipping Address
                </h2>
                {/* 
                   Shipping Details Section: Collects user address and contact info.
                   قسم بيانات الشحن: يجمع عنوان المستخدم ومعلومات الاتصال.
                */}
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John"
                    className={inputClasses}
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }}
                  />
                  <AnimatePresence>
                    {errors?.firstName && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1"
                      >
                        {errors?.firstName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Doe"
                    className={inputClasses}
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }}
                  />
                  <AnimatePresence>
                    {errors?.lastName && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1"
                      >
                        {errors?.lastName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>Country</label>
                  <input
                    type="text"
                    className={`${inputClasses} cursor-not-allowed`}
                    value="Egypt"
                    readOnly
                  />
                </div>

                <div className="flex flex-col relative">
                  <div className="flex items-center justify-between">
                    <label className={labelClasses + " mb-0"}>
                      <span className="hidden sm:inline">State / City</span>
                      <span className="sm:hidden">State</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoLocation}
                      disabled={isDetectingLocation}
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-black hover:opacity-60 transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                      {isDetectingLocation ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <MapPin size={10} />
                      )}
                      <span>Geolocate</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={isDetectingLocation}
                    className={`${inputClasses} flex items-center justify-between text-left ${
                      isDetectingLocation ? "opacity-50 cursor-wait" : ""
                    }`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span
                      className={
                        state
                          ? "text-(--color-pakistan)"
                          : "text-(--color-dark)/40"
                      }
                    >
                      {isDetectingLocation
                        ? "Detecting..."
                        : state || "Select State"}
                    </span>
                    {isDetectingLocation ? (
                      <Loader2
                        size={18}
                        className="animate-spin text-(--color-tiger)"
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 p-3 rounded-none bg-white border border-black shadow-2xl z-50 overflow-hidden"
                      >
                        <input
                          type="text"
                          placeholder="SEARCH CITY..."
                          className="w-full p-4 mb-3 bg-gray-50 border border-transparent outline-none focus:border-black transition-all text-[10px] font-black uppercase tracking-widest"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          autoFocus
                        />

                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          {filteredStates.map((gov: string) => (
                            <button
                              key={gov}
                              type="button"
                              className={`w-full text-left px-5 py-4 transition-all text-[10px] font-black uppercase tracking-widest ${
                                state === gov
                                  ? "bg-black text-white"
                                  : "hover:bg-gray-50 text-black"
                              }`}
                              onClick={() => {
                                setState(gov);
                                setIsDropdownOpen(false);
                                setSearch("");
                                setErrors((prev) => ({ ...prev, state: "" }));
                              }}
                            >
                              {gov}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {errors.state && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col mt-2 md:mt-6">
                <label className={labelClasses}>Detailed Address</label>
                <textarea
                  placeholder="Street name, building number, apartment, etc."
                  rows={3}
                  className={`${inputClasses} resize-none`}
                  value={addressDetails}
                  onChange={(e) => {
                    setAddressDetails(e.target.value);
                    setErrors((prev) => ({ ...prev, addressDetails: "" }));
                  }}
                />
                <AnimatePresence>
                  {errors.addressDetails && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1"
                    >
                      {errors.addressDetails}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-6 mt-2 md:mt-6">
                <div className="flex flex-col">
                  <label className={labelClasses}>Primary Phone</label>
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    className={inputClasses}
                    value={phone1}
                    onChange={(e) => {
                      setPhone1(e.target.value);
                      setErrors((prev) => ({ ...prev, phone1: "" }));
                    }}
                  />
                  {errors.phone1 && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">
                      {errors.phone1}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className={labelClasses}>Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Alternative number"
                    className={inputClasses}
                    value={phone2}
                    onChange={(e) => {
                      setPhone2(e.target.value);
                      setErrors((prev) => ({ ...prev, phone2: "" }));
                    }}
                  />
                  {errors.phone2 && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">
                      {errors.phone2}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 flex items-center">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-100 border border-transparent peer-checked:bg-black transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white transition-transform peer-checked:translate-x-4"></div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black group-hover:opacity-60 transition-opacity">
                    Save Address for Later
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Payment Card */}
            <motion.div variants={itemVariants} className={cardClasses}>
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                <div className="text-black">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-black text-black uppercase tracking-tighter">
                  Payment Protocol
                </h2>
                {/* 
                   Payment Method Section: Allows choosing between Card, Wallet, or Cash.
                   قسم طريقة الدفع: يسمح بالاختيار بين البطاقة، المحفظة الإلكترونية، أو الدفع نقداً.
                */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                {[
                  {
                    id: "credit_card",
                    title: "Card",
                    subtitle: "Visa / Mastercard",
                    icon: <CreditCard size={20} />,
                  },
                  {
                    id: "vodafone_cash",
                    title: "E-Wallet",
                    subtitle: "Vodafone / Orange / Etisalat",
                    icon: <Wallet size={20} />,
                  },
                  {
                    id: "instaPay",
                    title: "InstaPay",
                    subtitle: "Instant Bank Transfer",
                    icon: <Smartphone size={20} />,
                  },
                  {
                    id: "cash_on_delivery",
                    title: "Cash on Delivery",
                    subtitle: "Pay when you receive",
                    icon: <Truck size={20} />,
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (isPaying || data?.carts?.items.length === 0) return;
                      handleSelectMethod(m.id);
                    }}
                    className={`relative flex items-center gap-4 p-5 rounded-none border transition-all duration-300 ${
                      paymentMethod === m.id
                        ? "border-black bg-gray-50"
                        : "border-gray-50 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`transition-colors ${
                        paymentMethod === m.id ? "text-black" : "text-gray-300"
                      }`}
                    >
                      {m.icon}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-black">
                        {m.title}
                      </h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                        {m.subtitle}
                      </p>
                    </div>
                    {paymentMethod === m.id && (
                      <motion.div
                        layoutId="active-payment"
                        className="absolute top-2 right-2 text-black"
                      >
                        <ShieldCheck size={12} />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {openSection === "instaPay" ||
                openSection === "vodafone_cash" ? (
                  <motion.div
                    key="wallet-info"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-6 rounded-3xl bg-white/30 border border-white/60 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 text-black text-[10px] font-black uppercase tracking-widest mb-6 pb-2 border-b border-gray-50">
                      <Smartphone size={14} />
                      Transfer Target
                    </div>
                    <div className="relative group mb-8">
                      <div className="p-6 bg-gray-50 border border-gray-100 rounded-none font-black text-black text-center text-3xl tracking-[0.3em] transition-all">
                        {BRAND_PHONE}
                      </div>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(BRAND_PHONE)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-none">
                      <div className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-widest mb-4">
                        <Info size={14} /> Protocol Notes
                      </div>
                      <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-gray-400 list-none">
                        <li className="flex gap-3">
                          <span className="text-black">01.</span>
                          Exact transfer required to target.
                        </li>
                        <li className="flex gap-3">
                          <span className="text-black">02.</span>
                          Manual verification flow follows.
                        </li>
                        <li className="flex gap-3">
                          <span className="text-black">03.</span>
                          Account number synchronization check.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                ) : null}

                {openSection === "credit_card" ? (
                  <motion.div
                    key="card-info"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 mb-4"
                  >
                    {!firstName || !lastName || !email || !phone1 || !state ? (
                      <div className="p-5 bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                        <Info size={14} /> Dispatch Protocol required first
                      </div>
                    ) : (
                      <PaymobPayment
                        paymentData={{
                          amount: finalTotal,
                          first_name: firstName,
                          last_name: lastName,
                          email: email,
                          phone_number: phone1,
                          city: state,
                        }}
                        setIsPaying={() => setIsPaying(false)}
                        onCardValidityChange={(v) => setIsCardValid(v)}
                        triggerPayRef={payRef}
                        handlePayment={handlePayment}
                      />
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {errors.paymentMethod && (
                <div className="mt-6 p-5 bg-red-50 border border-red-100 text-[10px] font-black uppercase tracking-widest text-red-500">
                  {errors.paymentMethod}
                </div>
              )}
            </motion.div>
          </div>

          {/* Checkout Summary Column */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div variants={itemVariants} className={cardClasses}>
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                <div className="text-black">
                  <ShoppingCart size={20} />
                </div>
                <h2 className="text-xl font-black text-black uppercase tracking-tighter">
                  Order Summary
                </h2>
                {/* 
                   Order Summary Section: Displays cart items, delivery fees, and final total.
                   قسم ملخص الطلب: يعرض عناصر السلة، مصاريف الشحن، وإجمالي المبلغ.
                */}
              </div>

              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-6 animate-pulse">
                      <div className="w-24 h-32 bg-gray-50 rounded-none" />
                      <div className="flex-1 space-y-4 py-2">
                        <div className="h-2 bg-gray-50 rounded w-2/3" />
                        <div className="h-2 bg-gray-50 rounded w-1/3" />
                        <div className="h-4 bg-gray-50 rounded w-1/4 mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.carts?.items.length === 0 ? (
                <div className="text-center py-16 space-y-6">
                  <div className="text-gray-100 flex justify-center mb-8">
                    <ShoppingCart size={48} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                    Empty Archive
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all border border-black"
                  >
                    Enter Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  {data?.carts?.items.map((item: CartItemType) => (
                    <div
                      key={item.id}
                      className="group flex gap-6 p-4 bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all duration-300"
                    >
                      <div className="relative w-20 h-28 shrink-0 overflow-hidden bg-white">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest truncate">
                              {item.product.name}
                            </h3>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                              QTY: {item.quantity}
                            </span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            DIM: {item.sizes.size} • {item.sizes.length}X
                            {item.sizes.width}CM
                          </p>
                        </div>
                        <p className="text-xs font-black text-black">
                          {item.product.price.toLocaleString()} EGP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-white/60 space-y-6">
                {/* Promo Code section */}
                <div className="space-y-3">
                  <div className="flex border border-gray-100">
                    <div className="relative flex-1">
                      <Tag
                        size={12}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      />
                      <input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ACCESS CODE"
                        className="w-full pl-11 pr-4 py-4 outline-none bg-white text-[10px] font-black uppercase tracking-widest placeholder:text-gray-200"
                      />
                    </div>
                    <button
                      onClick={applyDiscount}
                      className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
                    >
                      Verify
                    </button>
                  </div>
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1 mt-2"
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                    {discount > 0 && (
                      <motion.p
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ml-1 mt-2"
                      >
                        <span className="flex h-2 w-2 bg-green-500 animate-ping" />
                        Discount Applied: {discount}% OFF
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Base Value</span>
                    <span className="text-sm font-black text-black">
                      {(data?.carts?.total || 0).toLocaleString()} EGP
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-3">
                      <span>Dispatch</span>
                      {isFirstOrder && (
                        <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black tracking-widest">
                          Initial
                        </span>
                      )}
                    </div>
                    {isFirstOrder || freeDelivery ? (
                      <div className="flex items-center gap-3">
                        {rawDeliveryFee > 0 && (
                          <span className="opacity-30 line-through">
                            {rawDeliveryFee.toLocaleString()} EGP
                          </span>
                        )}
                        <span className="text-sm font-black text-black">
                          FREE
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-black text-black">
                        {(deliveryFee || 0).toLocaleString()} EGP
                      </span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black">
                      <span>Reduction</span>
                      <span className="text-sm font-black">
                        -
                        {(
                          (data?.carts?.total || 0) *
                          (discount / 100)
                        ).toLocaleString()}{" "}
                        EGP
                      </span>
                    </div>
                  )}

                  <div className="pt-8 border-t-2 border-black flex justify-between items-end text-black">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 block mb-2">
                        Total Amount
                      </span>
                      <span className="text-4xl font-black tracking-tighter">
                        {(finalTotal || 0).toLocaleString()} EGP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button (Desktop) */}
                <div className="pt-4">
                  {paymentMethod === "credit_card" ? (
                    <button
                      disabled={!isCardValid || isPaying}
                      onClick={() => {
                        setIsPaying(true);
                        payRef.current?.();
                      }}
                      className="w-full py-6 bg-black text-white font-black text-xs uppercase tracking-[0.3em] hover:opacity-80 transition-all disabled:opacity-30 flex items-center justify-center border border-black"
                    >
                      {isPaying ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <span>
                          Execute Transaction:{" "}
                          {(finalTotal || 0).toLocaleString()} EGP
                        </span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handlePayment}
                      disabled={orderLoading || data?.carts?.items.length === 0}
                      className="w-full py-6 bg-black text-white font-black text-xs uppercase tracking-[0.3em] hover:opacity-80 transition-all disabled:opacity-30 flex items-center justify-center border border-black"
                    >
                      {orderLoading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "Complete Order"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto mt-20 pt-12 border-t border-gray-100 text-center"
        >
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10">
            <Link
              to="/shipping-delivery"
              className="hover:text-black transition-colors"
            >
              Dispatch
            </Link>
            <Link
              to="/return-exchange-policy"
              className="hover:text-black transition-colors"
            >
              Returns
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-black transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms-conditions"
              className="hover:text-black transition-colors"
            >
              Terms
            </Link>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-200">
            ROOTS SECURE ARCHIVE GATEWAY
          </p>
        </motion.div>
      </div>
    </div>
  );
}
