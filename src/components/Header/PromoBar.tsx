import { Link } from "react-router-dom";

export default function PromoBar() {
  return (
    <div className="w-full bg-(--color-dark) text-white py-3 px-4 relative z-50">
      <div className="max-w-[1920px] mx-auto flex items-center justify-center">
        <p className="text-[9px] md:text-[10px] font-bold tracking-[0.35em] uppercase text-center">
          Complimentary shipping on orders over 1000 EGP —
          <Link
            to="/products"
            className="ml-2 border-b border-white/30 hover:border-white transition-all pb-0.5"
          >
            Shop Now
          </Link>
        </p>
      </div>
    </div>
  );
}
    