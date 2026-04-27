// app/(main)/page.tsx
import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
// import { CategorySection } from "@/components/sections/CategorySection/CategorySection";
import { LatestChronicles } from "@/components/sections/LatestChronicles/LatestChronicles";
import { Newsletter } from "@/components/sections/Newsletter/Newsletter";
import { Footer } from "@/components/layout/Footer/Footer"; 

export default function Home() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted/20" />}>
        <LatestChronicles />
      </Suspense>
      <Suspense fallback={<div className="h-48 animate-pulse bg-muted/10" />}>
        <Newsletter />
      </Suspense>
      <Footer />
    </>
  );
}
