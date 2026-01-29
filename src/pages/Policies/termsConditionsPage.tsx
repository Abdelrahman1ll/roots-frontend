import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import TermsConditions from "../../components/Policies/termsConditions";

export default function TermsConditionsPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <TermsConditions />

      <Footer />
    </>
  );
}
