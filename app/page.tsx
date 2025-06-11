import HeroSection from "./components/HeroSection";
import ProjectSection from "./components/ProjectSection"
import AboutSection from "./components/AboutSection"

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col bg-zinc-900">
        <div className="container mx-auto px-12 py-4">
          <HeroSection />
          <ProjectSection />
          <AboutSection />
        </div>
      </main>
  );
}
