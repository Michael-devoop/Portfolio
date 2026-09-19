import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/layout/Loader';
import Header from './components/layout/Header';
import ThemeToggle from './components/layout/ThemeToggle';
import Footer from './components/layout/Footer';
import ShootingStarsGrid from './components/ui/ShootingStarsGrid';
import HeroSection from './sections/HeroSection';
import PortfolioSection from './sections/PortfolioSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ResumeSection from './sections/ResumeSection';
import ContactSection from './sections/ContactSection';

export default function App() {
  return (
    <ThemeProvider>
      <Loader />
      <ThemeToggle />

      <main className="relative">
        <HeroSection />

        {/* Content sections with ShootingStarsGrid background */}
        <div className="relative z-10">
          {/* Sticky shooting stars background behind content */}
          <div className="sticky top-0 h-screen w-full -mb-[100vh] z-0 overflow-hidden">
            <ShootingStarsGrid
              backgroundColor="#09090b"
              gridSize={64}
              gridLineColor="rgba(255, 255, 255, 0.08)"
              pulseMinOpacity={0.7}
              pulseMaxOpacity={1}
              pulseDuration={6}
              maskInnerStop={10}
              maskOuterStop={95}
              glowColor="rgba(22, 163, 74, 1)"
              glowOpacity={0.08}
              glowBlur={140}
              glowWidth={900}
              glowHeight={700}
              spawnRateMin={150}
              spawnRateMax={450}
              speedMin={1500}
              speedMax={4000}
              maxActiveStars={20}
              trailLength={200}
              thickness={2}
              color1="rgba(6, 182, 212, 1)"
              color2="rgba(139, 92, 246, 1)"
              color3="rgba(244, 244, 245, 0.9)"
            />
          </div>

          {/* Actual content with semi-transparent bg so grid peeks through */}
          <div className="relative z-10 bg-brand-light-surface/80 dark:bg-brand-dark/60">
            <PortfolioSection />
            <AboutSection />
            <ServicesSection />
            <ResumeSection />
            <ContactSection />
          </div>
        </div>

        {/* Footer sits on top of the ChaosGrid hero background */}
        <div className="relative z-10">
          <Footer />
        </div>
      </main>

      <Header />
    </ThemeProvider>
  );
}
