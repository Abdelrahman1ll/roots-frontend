import { Link } from "react-router-dom";
import { BRAND_NAME, BRAND_STORY } from "../../BrandText";
import { ChevronDown, CreditCard, Wallet, Truck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-(--color-border) pt-24 pb-12 px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
        {/* Brand Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-[0.2em] text-(--color-dark) uppercase">
              {BRAND_NAME}
            </h2>
            <p className="text-xs font-medium text-(--color-pakistan) max-w-sm leading-relaxed uppercase tracking-wide">
              {BRAND_STORY}
            </p>
          </div>
        </div>

        {/* Links Sections */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-12 sm:gap-24">
          {/* Information */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-(--color-dark) uppercase">
              Information
            </h3>
            <ul className="space-y-4 text-xs font-bold tracking-widest text-(--color-pakistan) uppercase">
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-delivery"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-in-egypt"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Shipping in Egypt
                </Link>
              </li>
              <li>
                <Link
                  to="/secure-payment"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Secure Payment
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-(--color-dark) uppercase">
              Legal
            </h3>
            <ul className="space-y-4 text-xs font-bold tracking-widest text-(--color-pakistan) uppercase">
              <li>
                <Link
                  to="/terms-conditions"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/return-exchange-policy"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link
                  to="/sales-payment-policy"
                  className="hover:text-(--color-dark) transition-colors hover:pl-2"
                >
                  Sales & Payment
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-24 pt-8 border-t border-(--color-border) flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="flex items-center gap-4 text-[10px] font-bold text-(--color-pakistan) tracking-widest uppercase">
            <span>
              Powered by{" "}
              <span className="text-(--color-dark)">{BRAND_NAME}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="w-8 h-5 flex items-center justify-center rounded border border-(--color-border)">
              <CreditCard size={12} strokeWidth={1} />
            </div>
            <div className="w-8 h-5 flex items-center justify-center rounded border border-(--color-border)">
              <Wallet size={12} strokeWidth={1} />
            </div>
            <div className="w-8 h-5 flex items-center justify-center rounded border border-(--color-border)">
              <Truck size={12} strokeWidth={1} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 text-[10px] font-bold text-(--color-pakistan) tracking-widest uppercase">
          <div className="flex items-center gap-2 cursor-pointer hover:text-(--color-dark) transition-colors">
            <span>English</span>
            <ChevronDown size={12} />
          </div>
          <span>
            © {new Date().getFullYear()} {BRAND_NAME}.
          </span>
        </div>
      </div>
    </footer>
  );
}
