import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import ShippingDelivery from "../../components/QuickLinks/shippingDelivery";

export default function ShippingDeliveryPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <ShippingDelivery />

      <Footer />
    </>
  );
}
