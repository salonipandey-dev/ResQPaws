import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/home/Hero";
import { Partners } from "@/components/home/Partners";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Features } from "@/components/home/Features";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Partners />
      <HowItWorks />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
      <FloatingActions />
    </main>
  );
}
