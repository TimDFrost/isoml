import { Hero } from "@/components/sections/hero";
import { Mission } from "@/components/sections/mission";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { JusticeDataEngine } from "@/components/sections/justice-data-engine";
import { ProductSuite } from "@/components/sections/product-suite";
import { InteractiveDemo } from "@/components/sections/interactive-demo";
import { GapAnalysis } from "@/components/sections/gap-analysis";
import { SearchExperience } from "@/components/sections/search-experience";
import { WhyIsoml } from "@/components/sections/why-isoml";
import { BuiltFor } from "@/components/sections/built-for";
import { HumanJudgment } from "@/components/sections/human-judgment";
import { DesignPartner } from "@/components/sections/design-partner";
import { Founder } from "@/components/sections/founder";
import { PitchDeck } from "@/components/sections/pitch-deck";
import { FAQ } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <ProblemSolution />
      <JusticeDataEngine />
      <ProductSuite />
      <InteractiveDemo />
      <GapAnalysis />
      <SearchExperience />
      <WhyIsoml />
      <BuiltFor />
      <HumanJudgment />
      <DesignPartner />
      <Founder />
      <PitchDeck />
      <FAQ />
    </>
  );
}
