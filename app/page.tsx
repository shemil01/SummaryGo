import BgGradient from "@/components/common/bg-gradient";
import HowItWork from "@/components/home/how-it-work";
import DemoSection from "@/components/home/demo-section";
import HeroSection from "@/components/home/hero-section";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col w-full">
        <HeroSection />
        <DemoSection />
        <HowItWork />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  );
}
