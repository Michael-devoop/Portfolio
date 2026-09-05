import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from '@phosphor-icons/react';
import ChaosGrid from '../components/ui/ChaosGrid';
import { personalInfo } from '../data/contact';

export default function HeroSection() {
  // ─── useRef: section reference for scroll tracking ───
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);

  // ─── useState: visibility after loader + window height ───
  const [isVisible, setIsVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  // ─── useEffect: trigger entrance animation after loader ───
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2400);
    return () => clearTimeout(timer);
  }, []);

  // ─── useEffect: track window height ───
  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // ─── useEffect: intersection observer for headline ───
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-8');
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── Framer Motion scroll parallax ───
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  const handleScrollClick = (e) => {
    e.preventDefault();
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ChaosGrid Background — fixed behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <ChaosGrid
          particleSpacing={35}
          chaosStrength={1.5}
          connectionDistance={55}
          showDivider={false}
          mouseInteraction={true}
          mouseRadius={120}
          mouseStrength={0.4}
          orderPercentage={45}
        />
      </div>

      {/* Hero Content — also fixed, stays in place while page scrolls over */}
      <div className="fixed inset-0 z-[1] pointer-events-none flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pointer-events-auto">
          <div
            ref={headlineRef}
            className={`max-w-3xl transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-body-base md:text-body-lg text-brand-text-secondary dark:text-brand-text-dark-secondary mb-4 leading-relaxed">
              {personalInfo.subtitle.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < personalInfo.subtitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>

            <h1 className="font-display text-display-lg text-brand-text-primary dark:text-brand-text-dark-primary mb-6">
              {personalInfo.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < personalInfo.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>

            <a
              href="#portfolio"
              onClick={handleScrollClick}
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-brand-text-secondary dark:text-brand-text-dark-secondary border-b border-brand-border dark:border-brand-border-dark pb-2 transition-all duration-300 hover:text-brand-accent hover:border-brand-accent group"
            >
              <span>Scroll for more</span>
              <ArrowDownRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Spacer — provides scroll height so sections below start after hero viewport */}
      <section
        id="home"
        ref={sectionRef}
        className="relative z-10"
        style={{ height: '100vh' }}
      />
    </>
  );
}
