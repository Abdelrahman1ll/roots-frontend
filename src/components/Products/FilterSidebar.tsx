import { useEffect, useRef, useState } from "react";
import { useGetCategoryQuery } from "../../redux/category/apiCategory";
import { useGetColorsQuery } from "../../redux/color/apiColor";
import { useSearchParams, type URLSearchParamsInit } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/products/apiProducts";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Price: Low to High", value: "price-low" },
];

// --- Helper Component ---
const Accordion = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-(--color-pakistan)/20 py-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-black text-black hover:opacity-60 transition-opacity group"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-black"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * FilterSidebar: A slide-over drawer component for filtering products by category, price, and color.
 * شريط التصفية الجانبي: مكون درج ينسحب لتصفية المنتجات حسب الفئة، السعر، واللون.
 */
export default function FilterSidebar() {
  const MIN_PRICE = 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Featured");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || maxPrice === 0) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const value = Math.round(percentage * (maxPrice - MIN_PRICE) + MIN_PRICE);

    const distMin = Math.abs(value - priceRange[0]);
    const distMax = Math.abs(value - priceRange[1]);

    if (distMin < distMax) {
      // Moves closer to min
      const newMin = Math.min(value, priceRange[1] - 10);
      setPriceRange([newMin, priceRange[1]]);
    } else {
      // Moves closer to max
      const newMax = Math.max(value, priceRange[0] + 10);
      setPriceRange([priceRange[0], newMax]);
    }
  };

  /* ================= API ================= */
  const { data } = useGetCategoryQuery({});
  const category = data?.categories || [];

  const { data: colorData } = useGetColorsQuery({});
  const colorsList = colorData?.colors || [];

  const { data: productsData } = useGetProductsQuery("/products");

  /* ================= Compute max price ================= */
  useEffect(() => {
    const products = productsData?.products || [];
    if (!products.length || maxPrice) return;

    const computed = Math.max(
      ...products.map((p: { price: number | string }) => Number(p.price)),
    );
    setMaxPrice(computed);
    if (priceRange[1] === 0) {
      setPriceRange([MIN_PRICE, computed]);
    }
  }, [productsData?.products, maxPrice, priceRange]);

  /* ================= Read from URL ================= */
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const colorParam = searchParams.get("color");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const sortParam = searchParams.get("sortPrice");
    const bestSelling = searchParams.get("bestSelling");

    if (categoryParam) {
      setSelectedCats(categoryParam.split(","));
    }

    if (colorParam) {
      setSelectedColors(colorParam.split(","));
    }

    if (minPriceParam || maxPriceParam) {
      setPriceRange([
        minPriceParam ? Number(minPriceParam) : MIN_PRICE,
        maxPriceParam ? Number(maxPriceParam) : maxPrice,
      ]);
    }

    if (sortParam) {
      if (sortParam === "asc") {
        setSelectedSort("Price: Low to High");
      } else if (sortParam === "desc") {
        setSelectedSort("Price: High to Low");
      }
    }

    if (bestSelling) {
      setSelectedSort("Best Selling");
    }

    initialized.current = true;
  }, [maxPrice, searchParams]);

  /* ================= Write to URL ================= */
  useEffect(() => {
    if (!initialized.current) return;
    const params: Record<string, string | number | boolean> = {};

    if (selectedCats.length > 0) {
      params.category = selectedCats.join(",");
    }

    if (selectedColors.length > 0) {
      params.color = selectedColors.join(",");
    }

    const nameParam = searchParams.get("name") || "";
    if (priceRange[0] !== 0 || priceRange[1] !== maxPrice) {
      params.minPrice = priceRange[0];
      params.maxPrice = priceRange[1];
    }

    if (selectedSort === "Best Selling") {
      params.bestSelling = true;
    }

    if (selectedSort === "Price: High to Low") {
      params.sortPrice = "desc";
    } else if (selectedSort === "Price: Low to High") {
      params.sortPrice = "asc";
    }

    if (nameParam) {
      params.name = nameParam;
    }

    setSearchParams(params as unknown as URLSearchParamsInit);
  }, [
    selectedCats,
    selectedColors,
    priceRange,
    selectedSort,
    setSearchParams,
    searchParams,
    maxPrice,
  ]);

  /* ================= Helpers ================= */
  const toggleList = (
    item: string,
    list: string[],
    setList: (l: string[]) => void,
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  const handleClearAll = () => {
    setSelectedCats([]);
    setSelectedColors([]);
    setPriceRange([MIN_PRICE, maxPrice]);
    setSelectedSort("Featured");
  };

  /* ================= UI ================= */
  return (
    <div className="m-4 mb-8">
      {/* Action Bar: Filters | Search | Sort */}
      <div className="w-full mx-auto px-4">
        <div className="flex flex-row items-center justify-between mb-12">
          {/* Left: Filter Drawer Trigger */}
          <div className="w-40 md:w-64">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white border border-gray-100 shadow-sm
                   hover:border-black transition-all cursor-pointer font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] group"
            >
              <SlidersHorizontal
                size={12}
                className="text-black group-hover:rotate-12 transition-transform shrink-0"
              />
              <span className="truncate">Adjust</span>
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>

          {/* Right: Sort Select Dropdown */}
          <div className="w-40 md:w-64 relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full flex items-center justify-between gap-2 px-4 py-4 bg-white border border-gray-100 shadow-sm
                   hover:border-black transition-all cursor-pointer font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] group"
            >
              <span className="truncate text-left">Seq: {selectedSort}</span>
              <motion.div
                animate={{ rotate: sortOpen ? 180 : 0 }}
                className="text-black shrink-0"
              >
                <ChevronDown size={14} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {sortOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setSortOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute right-0 top-full mt-2 w-full min-w-[200px] bg-white rounded-none shadow-2xl border border-gray-100 z-100 overflow-hidden py-2"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSort(option.label);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group
                      ${
                        selectedSort === option.label
                          ? "bg-black text-white"
                          : "text-gray-400 hover:bg-gray-50 hover:text-black"
                      }`}
                      >
                        <span>{option.label}</span>
                        {selectedSort === option.label && <Check size={12} />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-(--color-pakistan)/40 backdrop-blur-sm transition-opacity"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[320px] md:max-w-sm bg-white p-8 shadow-2xl h-full z-100 overflow-y-auto scrollbar-hide border-r border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-black flex items-center gap-3 uppercase tracking-tighter">
                    Filters
                    <SlidersHorizontal size={14} className="text-black" />
                  </h2>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-2">
                    Refine Protocol
                  </p>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-gray-50 text-black hover:bg-black hover:text-white transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <Accordion title="Category">
                  <div className="space-y-3 px-1">
                    {category.map((cat: { id: string; name: string }) => (
                      <div key={cat.id} className="flex items-center group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            id={cat.id}
                            checked={selectedCats.includes(String(cat.id))}
                            onChange={() =>
                              toggleList(
                                String(cat.id),
                                selectedCats,
                                setSelectedCats,
                              )
                            }
                            className="peer h-4 w-4 rounded-none border border-gray-100 appearance-none 
                                    checked:bg-black checked:border-black transition-all cursor-pointer"
                          />
                          <Check
                            size={10}
                            className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                            strokeWidth={4}
                          />
                        </div>

                        <label
                          htmlFor={cat.id}
                          className="ml-3 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer group-hover:text-black transition-colors"
                        >
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </Accordion>

                <Accordion title="Price Range">
                  <div className="space-y-6 pt-2 pb-4 px-3">
                    <div
                      ref={sliderRef}
                      onClick={handleTrackClick}
                      className="relative h-2 flex items-center cursor-pointer touch-none"
                    >
                      {/* Track Background */}
                      <div className="absolute left-0 right-0 h-0.5 bg-gray-50 px-px" />

                      {/* Active Track */}
                      <motion.div
                        className="absolute h-0.5 bg-black"
                        style={{
                          left: `${
                            ((priceRange[0] - MIN_PRICE) /
                              (maxPrice - MIN_PRICE)) *
                            100
                          }%`,
                          right: `${
                            100 -
                            ((priceRange[1] - MIN_PRICE) /
                              (maxPrice - MIN_PRICE)) *
                              100
                          }%`,
                        }}
                      />

                      {/* Min Slider */}
                      <input
                        type="range"
                        min={MIN_PRICE}
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent bubbling to track click
                          setPriceRange([
                            Math.min(
                              Number(e.target.value),
                              priceRange[1] - 10,
                            ),
                            priceRange[1],
                          ]);
                        }}
                        style={{
                          zIndex: priceRange[0] > maxPrice - 100 ? "40" : "30",
                        }}
                        className="absolute w-full h-2 appearance-none cursor-pointer bg-transparent pointer-events-none 
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-4
              [&::-webkit-slider-thumb]:border-(--color-tiger)
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:hover:scale-125
              [&::-webkit-slider-thumb]:transition-transform
              [&::-moz-range-thumb]:pointer-events-auto
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-4
              [&::-moz-range-thumb]:border-(--color-tiger)"
                      />

                      {/* Max Slider */}
                      <input
                        type="range"
                        min={MIN_PRICE}
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent bubbling to track click
                          setPriceRange([
                            priceRange[0],
                            Math.max(
                              Number(e.target.value),
                              priceRange[0] + 10,
                            ),
                          ]);
                        }}
                        className="absolute w-full h-2 appearance-none cursor-pointer bg-transparent pointer-events-none z-20
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-4
              [&::-webkit-slider-thumb]:border-(--color-tiger)
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:hover:scale-125
              [&::-webkit-slider-thumb]:transition-transform
              [&::-moz-range-thumb]:pointer-events-auto
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-4
              [&::-moz-range-thumb]:border-(--color-tiger)"
                      />
                    </div>

                    {/* Price Display */}
                    <div className="flex items-center justify-between px-2">
                      <div className="bg-gray-50 px-3 py-1 border border-gray-100 flex flex-col items-center flex-1">
                        <span className="text-[10px] uppercase font-black text-gray-300">
                          Min
                        </span>
                        <span className="text-sm font-black text-black">
                          {priceRange[0]}{" "}
                          <span className="text-[10px]">EGP</span>
                        </span>
                      </div>
                      <div className="h-px w-4 bg-gray-100 mt-2" />
                      <div className="bg-white px-3 py-1 border border-gray-100 flex flex-col items-center flex-1">
                        <span className="text-[10px] uppercase font-black text-gray-300">
                          Max
                        </span>
                        <span className="text-sm font-black text-black">
                          {priceRange[1]}{" "}
                          <span className="text-[10px]">EGP</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Color">
                  <div className="grid grid-cols-2 gap-3 px-1 py-1">
                    {colorsList.map(
                      (c: { name: string; color: string; id: string }) => (
                        <motion.div
                          key={c.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            toggleList(
                              String(c.id),
                              selectedColors,
                              setSelectedColors,
                            )
                          }
                          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border-2
                                ${
                                  selectedColors.includes(String(c.id))
                                    ? "bg-(--color-tiger)/5 border-(--color-tiger) shadow-sm"
                                    : "bg-(--color-pakistan)/5 border-transparent hover:border-(--color-pakistan)/10"
                                }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full relative flex items-center justify-center shadow-inner"
                            style={{ backgroundColor: c.color }}
                          >
                            {selectedColors.includes(String(c.id)) && (
                              <Check
                                size={14}
                                className="text-white drop-shadow-md"
                                strokeWidth={4}
                              />
                            )}
                          </div>
                          <span
                            className={`text-[13px] font-bold ${
                              selectedColors.includes(String(c.id))
                                ? "text-(--color-tiger)"
                                : "text-(--color-pakistan)/70"
                            }`}
                          >
                            {c.name}
                          </span>
                        </motion.div>
                      ),
                    )}
                  </div>
                </Accordion>

                <motion.button
                  whileHover={{ backgroundColor: "#000", color: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearAll}
                  className="w-full mt-8 py-5 px-4 bg-white border border-black text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer"
                >
                  Reset All Protocols
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
