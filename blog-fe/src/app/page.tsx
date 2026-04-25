import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { LatestChronicles } from "@/components/sections/LatestChronicles/LatestChronicles";
import { Newsletter } from "@/components/sections/Newsletter/Newsletter";
import { Footer } from "@/components/layout/Footer/Footer"; 

export default function Home() {
  return (
    <>
      <HeroSection />
      <LatestChronicles />
      <Newsletter />
      <Footer />
    </>
  );
}