import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import ProductDetail from "../../components/Products/ProductDetail";
import RelatedProducts from "../../components/Products/RelatedProducts";
import Reviews from "../../components/Reviews/reviews";

export default function ProductDetailsPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <ProductDetail />

      <Reviews limit={1} />

      <RelatedProducts />

      <Footer />
    </>
  );
}
