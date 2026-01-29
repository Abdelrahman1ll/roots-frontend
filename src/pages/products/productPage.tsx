import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import FilterSidebar from "../../components/Products/FilterSidebar";
import Product from "../../components/Products/product";
export default function ProductsPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <h2
        className="text-3xl md:text-4xl font-bold mt-10 text-center mb-20"
        style={{ color: "var(--color-dark)" }}
      >
        Products
      </h2>

      <FilterSidebar />

      <Product />


      <Footer />
    </>
  );
}
