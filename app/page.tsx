import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import ProjectIndex from "@/components/ProjectIndex";
import Approach from "@/components/Approach";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <ProjectIndex />
        <Approach />
        <Skills />
        <Timeline />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
