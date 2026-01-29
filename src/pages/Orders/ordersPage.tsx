import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import Orders from "../../components/Orders/orders";

export default function OrdersPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />
      
      <Orders />

      <Footer />
    </>
  );
}
