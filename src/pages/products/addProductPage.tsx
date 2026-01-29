import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import ProductForm from "../../components/Products/ProductForm";

export default function AddProductPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <ProductForm mode="add" />

      <Footer />
    </>
  );
}
