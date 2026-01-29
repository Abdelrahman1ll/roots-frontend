import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import WorldwideShipping from "../../components/QuickLinks/WorldwideShipping";

/**
 * WorldwideShippingPage: Page wrapper for the Worldwide Shipping component.
 * صفحة الشحن الدولي: غلاف الصفحة لمكون الشحن الدولي.
 */
export default function WorldwideShippingPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <WorldwideShipping />

      <Footer />
    </>
  );
}
