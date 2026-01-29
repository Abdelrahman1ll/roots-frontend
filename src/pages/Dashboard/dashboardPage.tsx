import BackButton from "../../components/BackButton";
import Dashboard from "../../components/Dashboard/Dashboard";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";

export default function DashboardPage() {
  return (
    <>
      <PromoBar />

      <Header />

      <BackButton />

      <Dashboard />

      <Footer />
    </>
  );
}
