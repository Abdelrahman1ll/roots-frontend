import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import PrivacyPolicy from "../../components/Policies/privacyPolicy";

export default function PrivacyPolicyPage() {
    return (
      <>
        <PromoBar />
  
        <Header />

        <BackButton />
  
        <PrivacyPolicy />
  
        <Footer />
      </>
    );
}