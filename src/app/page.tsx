// src/app/page.tsx

import Hero from "@/components/home/Hero";
import Traceability from "@/components/home/Traceability";
import RnDCert from "@/components/home/RnDCert";
import Participation from "@/components/home/Participation";
import SalesChannels from "@/components/home/SalesChannels";
import HomeCTA from "@/components/home/HomeCTA";

export const metadata = {
  title: "Seed World | Ana Sayfa",
  description: "Ata tohumu, izlenebilir tedarik ve sürdürülebilir tarım ekosistemi.",
};

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Traceability />
      <RnDCert />
      <Participation />
      <SalesChannels />
      <HomeCTA />
    </div>
  );
}
