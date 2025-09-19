
import { Suspense } from "react";
import { LandingHero } from "@/components/landing/landing-hero";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CallToAction } from "@/components/landing/call-to-action";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Suspense fallback={<div className="min-h-screen bg-gradient-bg" />}>
          <LandingHero />
        </Suspense>
        
        <FeaturesSection />
        <HowItWorks />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
}
