import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import Reviews from "../../components/Reviews/reviews";

export default function ReviewsPage() {
  return (
    <>
      <PromoBar />
      <Header />
      <BackButton />

      <Reviews hideForm={true} />

      <Footer />
    </>
  );
}
