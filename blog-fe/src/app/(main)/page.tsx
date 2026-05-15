// app/(main)/page.tsx
export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import { HomePostSections } from "./HomePostSections";
import { Newsletter } from "@/components/sections/Newsletter/Newsletter";
import { Footer } from "@/components/layout/Footer/Footer"; 

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="h-screen animate-pulse bg-muted/20" />}>
        <HomePostSections />
      </Suspense>
      <Suspense fallback={<div className="h-48 animate-pulse bg-muted/10" />}>
        <Newsletter />
      </Suspense>
      <Footer />
    </>
  );
}

