import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import EditUserOwner from "../../components/Users/EditUserOwner";

export default function EditUserOwnerPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <EditUserOwner />

      <Footer />
    </>
  );
}
