import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { LocationSection } from "@/components/home/LocationSection";
import { ShopPreviewSection } from "@/components/home/ShopPreviewSection";
import { TournamentSection } from "@/components/home/TournamentSection";
import { ContactSection } from "@/components/home/ContactSection";
import { MessageCircle } from "lucide-react";

const HomePage = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/917010905241?text=Hi! I want to book a gaming slot.", "_blank");
  };

  return (
    <Layout hideHeaderPadding>
      <HeroSection />
      <ServicesSection />
      <LocationSection />
      <ShopPreviewSection />
      <TournamentSection />
      <ContactSection />

      {/* Floating WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-24 md:bottom-5 right-5 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 active:scale-95 transition-transform z-40 hover:shadow-green-500/50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </button>
    </Layout>
  );
};

export default HomePage;
