import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import HomeProducts from "../../components/Home/homeProducts";
import Main from "../../components/Home/main";
import Product from "../../components/Products/product";

import PromoBar from "../../components/Header/PromoBar";

export default function HomePage() {
  return (
    <>
      <PromoBar />
      <Header />

      <BackButton />

      <Main />

      <HomeProducts />

      <div className="text-center mb-16 space-y-3 px-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-(--color-tiger) block opacity-80">
          Our Collection
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-(--color-pakistan) tracking-tight uppercase">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-(--color-dark) to-(--color-pakistan)">
            Products
          </span>
        </h2>
      </div>

      <Product />

      <Footer />
    </>
  );
}
