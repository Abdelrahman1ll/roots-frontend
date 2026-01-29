import AllUsersMessages from "../../components/AllUsersMessages/allUsersMessages";
import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import PromoBar from "../../components/Header/PromoBar";


export default function AllUsersMessagesPage() {
    return (
      <>
        <PromoBar />
  
        <Header />

        <BackButton />
  
        <AllUsersMessages />
  
        <Footer />
      </>
    );
}