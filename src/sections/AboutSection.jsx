import { useState, useEffect, useRef } from 'react';
import SectionName from '../components/ui/SectionName';
import SectionTitle from '../components/ui/SectionTitle';
import AnimateInUp from '../components/ui/AnimateInUp';
import Button from '../components/ui/Button';
import { personalInfo } from '../data/contact';

export default function AboutSection() {
  // ─── useRef: reference the image element for lazy-load observer ───
  const imageRef = useRef(null);

  // ─── useState: track whether image has loaded for fade-in effect ───
  const [imageLoaded, setImageLoaded] = useState(false);

  // ─── useState: track whether the section is in view ───
  const [isInView, setIsInView] = useState(false);

  // ─── useRef: reference for the section container ───
  const sectionRef = useRef(null);

  // ─── useEffect: intersection observer to detect when section enters viewport ───
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // only trigger once
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── useEffect: preload the about image when section is in view ───
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = 'https://res.cloudinary.com/dkceowz64/image/upload/v1788638336/ChatGPT_Image_Jul_9_2026_04_03_11_PM_fqbudz.png';
    img.onload = () => setImageLoaded(true);
  }, [isInView]);

  return (
    <section id="about" ref={sectionRef} className="py-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-layout">
          <SectionName name="About me" />

          <div className="section-content-col">
            <SectionTitle title="Approach and philosophy" />

            {/* About Image with fade-in on load */}
            <AnimateInUp className="mb-block">
              <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden bg-neutral-950 flex items-center justify-center shadow-xl border border-black/10 dark:border-white/10">
                <img
                  ref={imageRef}
                  src="https://res.cloudinary.com/dkceowz64/image/upload/v1788638336/ChatGPT_Image_Jul_9_2026_04_03_11_PM_fqbudz.png"
                  alt="About me"
                  className={`w-full h-full object-contain transition-opacity duration-700 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </AnimateInUp>

            {/* Bio + Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Bio Text */}
              <div className="md:col-span-2">
                <AnimateInUp>
                  <p className="text-body-lg leading-relaxed text-brand-text-secondary dark:text-brand-text-dark-secondary mb-8">
                    {personalInfo.bio}
                  </p>
                </AnimateInUp>
                <AnimateInUp delay={0.1}>
                  <Button href="#" variant="default">
                    Download CV
                  </Button>
                </AnimateInUp>
              </div>

              {/* Personal Info */}
              <div className="space-y-6">
                <AnimateInUp>
                  <h6 className="font-semibold text-brand-text-primary dark:text-brand-text-dark-primary">
                    {personalInfo.name}
                  </h6>
                </AnimateInUp>
                <AnimateInUp delay={0.05}>
                  <h6>
                    <a
                      href={personalInfo.phoneHref}
                      className="text-sm font-medium text-brand-text-primary dark:text-brand-text-dark-primary hover:text-brand-accent transition-colors duration-300 underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:decoration-brand-accent"
                    >
                      {personalInfo.phone}
                    </a>
                  </h6>
                </AnimateInUp>
                <AnimateInUp delay={0.1}>
                  <h6>
                    <a
                      href={personalInfo.emailHref}
                      className="text-sm font-medium text-brand-text-primary dark:text-brand-text-dark-primary hover:text-brand-accent transition-colors duration-300 underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:decoration-brand-accent"
                    >
                      {personalInfo.email}
                    </a>
                  </h6>
                </AnimateInUp>
                <AnimateInUp delay={0.15}>
                  <h6>
                    <a
                      href={personalInfo.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-text-primary dark:text-brand-text-dark-primary hover:text-brand-accent transition-colors duration-300 underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:decoration-brand-accent"
                    >
                      {personalInfo.location}
                    </a>
                  </h6>
                </AnimateInUp>
              </div>
            </div>
          </div>

          <div className="section-aside-col" />
        </div>
      </div>
    </section>
  );
}
