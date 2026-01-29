import BackButton from "../../components/BackButton";
import Delivery from "../../components/Delivery/AddDelivery";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";

export default function AddDeliveryPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <Delivery />

      <Footer />
    </>
  );
}
