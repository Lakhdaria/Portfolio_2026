import PrefsProvider from "@/components/PrefsProvider";
import BootIntro from "@/components/BootIntro";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import SkillCards from "@/components/SkillCards";
import WorkCards from "@/components/WorkCards";
import Arena from "@/components/Arena";
import Contact from "@/components/Contact";
import Companion from "@/components/Companion";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <PrefsProvider>
      <BootIntro />
      <SiteHeader />
      <main>
        <Hero />
        <SkillCards />
        <WorkCards />
        <Arena />
        <Contact />
      </main>
      <SiteFooter />
      <Companion />
    </PrefsProvider>
  );
}
