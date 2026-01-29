import PromoBar from "../../components/Header/PromoBar";
import Checkout from "../../components/Orders/Checkout";

/**
 * CheckoutPage: The main page for the checkout process.
 * صفحة الدفع: الصفحة الأساسية لعملية الدفع.
 */
export default function CheckoutPage() {
  return (
    <div>
      <PromoBar />

      <Checkout />
    </div>
  );
}
