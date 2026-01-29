import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";
import Wishlist from "../../components/wishlist/Wishlist";

export default function WishlistPage() {
  return (
    <div>
      <PromoBar />

      <Header />

      <BackButton />

      <h2
        className="text-3xl md:text-4xl font-bold mt-10 text-center"
        style={{ color: "var(--color-dark)" }}
      >
        My Wishlist
      </h2>

      <Wishlist />


      <Footer />
    </div>
  );
}
