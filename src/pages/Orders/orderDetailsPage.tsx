import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import OrderDetails from "../../components/Orders/OrderDetails";

export default function OrderDetailsPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <OrderDetails />

      <Footer />
    </>
  );
}
