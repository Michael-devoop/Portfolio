import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/layout/Loader';
import Header from './components/layout/Header';
import ThemeToggle from './components/layout/ThemeToggle';
import Footer from './components/layout/Footer';
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
        <div className="relative z-10 bg-brand-light-surface dark:bg-brand-dark">
          <PortfolioSection />
          <AboutSection />
          <ServicesSection />
          <ResumeSection />
          <ContactSection />
        </div>
      </main>

      <Footer />
      <Header />
    </ThemeProvider>
  );
}
