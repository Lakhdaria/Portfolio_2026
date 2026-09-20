import BootIntro from "@/components/BootIntro";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import SkillCards from "@/components/SkillCards";
import WorkCards from "@/components/WorkCards";
import Contact from "@/components/Contact";
import Companion from "@/components/Companion";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <BootIntro />
      <SiteHeader />
      <main>
        <Hero />
        <SkillCards />
        <WorkCards />
        <Contact />
      </main>
      <SiteFooter />
      <Companion />
    </>
  );
}
