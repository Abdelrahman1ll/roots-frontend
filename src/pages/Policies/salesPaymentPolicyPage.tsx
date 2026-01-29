import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import SalesPaymentPolicy from "../../components/Policies/salesPaymentPolicy";

export default function SalesPaymentPolicyPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <SalesPaymentPolicy />

      <Footer />
    </>
  );
}
