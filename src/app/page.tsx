import { CtaBand } from "@/components/marketing/CtaBand";
import { FeaturedExams } from "@/components/marketing/FeaturedExams";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { Navbar } from "@/components/marketing/Navbar";
import { PricingPreview } from "@/components/marketing/PricingPreview";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedExams />
        <PricingPreview />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
