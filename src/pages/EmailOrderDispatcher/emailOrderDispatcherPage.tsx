import BackButton from "../../components/BackButton";
import EmailOrderDispatcher from "../../components/EmailOrderDispatcher/emailOrderDispatcher";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";

export default function EmailOrderDispatcherPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <EmailOrderDispatcher />
      
      <Footer />
    </>
  );
}
