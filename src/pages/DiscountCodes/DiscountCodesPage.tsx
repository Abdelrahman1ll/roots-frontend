import BackButton from "../../components/BackButton";
import DiscountCodes from "../../components/DiscountCodes/discountCodes";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";

export default function DiscountCodesPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <DiscountCodes />

      <Footer />
    </>
  );
}
