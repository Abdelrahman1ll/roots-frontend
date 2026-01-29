import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import SecurePayment from "../../components/QuickLinks/SecurePayment";

/**
 * SecurePaymentPage: Page wrapper for the Secure Payment component.
 * صفحة الدفع الآمن: غلاف الصفحة لمكون الدفع الآمن.
 */
export default function SecurePaymentPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <SecurePayment />

      <Footer />
    </>
  );
}
