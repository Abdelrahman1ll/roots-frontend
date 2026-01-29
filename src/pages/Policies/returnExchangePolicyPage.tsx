import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import ReturnExchangePolicy from "../../components/Policies/returnExchangePolicy";

export default function ReturnExchangePolicyPage() {
    return (
      <>
        <PromoBar />
  
        <Header />

        <BackButton />
  
        <ReturnExchangePolicy />
  
        <Footer />
      </>
    );
}