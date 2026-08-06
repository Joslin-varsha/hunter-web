import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import BestSelling from "../../components/BestSelling";
import Categories from "../../components/Categories";
import NewArrivals from "../../components/NewArrivals";
import BrandStory from "../../components/BrandStory";
import Footer from "../../components/Footer";
import MobileBottomNav from "../../components/MobileBottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <Hero />
      <BestSelling />
      <Categories />
      <NewArrivals />
      <BrandStory />
      <Footer />
      <MobileBottomNav />
    </main>
  );
}