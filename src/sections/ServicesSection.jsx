import { useState, useEffect, useRef } from 'react';
import { BezierCurve, Code, Cube, ChartLine, Database, Layout, Sparkle } from '@phosphor-icons/react';
import SectionName from '../components/ui/SectionName';
import SectionTitle from '../components/ui/SectionTitle';
import { services } from '../data/services';

const iconMap = {
  BezierCurve,
  Code,
  Cube,
  ChartLine,
  Database,
  Layout,
  Sparkle,
};

function ServiceCard({ service, index }) {
  // ─── useRef: reference to the card DOM element ───
  const cardRef = useRef(null);

  // ─── useState: track card scroll progress for sticky scaling ───
  const [scale, setScale] = useState(0.92);


  // ─── useEffect: observe card scroll position for stacking effect ───
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: 0 when card is at bottom of viewport, 1 when at top
      const progress = Math.max(0, Math.min(1, 1 - rect.top / viewH));

      setScale(0.92 + progress * 0.08); // 0.92 → 1.0
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const Icon = iconMap[service.iconName] || BezierCurve;

  return (
    <div
      ref={cardRef}
      className="sticky top-24 mb-8"
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
      }}
    >
      <div className="bg-brand-light-surface dark:bg-brand-dark-surface border border-brand-border dark:border-brand-border-dark rounded-3xl shadow-xl p-6 md:p-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Service Info */}
          <div className="space-y-6">
            <h3 className="font-display text-display-md text-brand-text-primary dark:text-brand-text-dark-primary">
              {service.title}
            </h3>
            <div className="flex items-start gap-4">
              <Icon size={32} weight="thin" className="text-brand-accent shrink-0 mt-1" />
              <p className="text-body-lg leading-relaxed text-brand-text-secondary dark:text-brand-text-dark-secondary">
                {service.description}
              </p>
            </div>
          </div>

          {/* Service Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[6/5]">
            <picture>
              <source media="(max-width: 768px)" srcSet={service.imageMedium} />
              <img
                src={service.imageSmall}
                alt={service.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  // ─── useRef: reference to the stacking container ───
  const stackRef = useRef(null);

  // ─── useState: track which card index is currently "active" (topmost) ───
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // ─── useEffect: update active card based on scroll position ───
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const handleScroll = () => {
      const children = el.querySelectorAll('[class*="sticky"]');
      let closest = 0;

      children.forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          closest = i;
        }
      });

      setActiveCardIndex(closest);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="services" className="py-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-layout">
          <SectionName name="Services" />

          <div className="section-content-col">
            <SectionTitle
              title="Creating impactful projects"
              subtitle="From modern responsive web applications and enterprise software to custom Odoo workflows and AI-accelerated development."
            />

            {/* Stacking Cards */}
            <div ref={stackRef} className="relative">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="section-aside-col" />
        </div>
      </div>
    </section>
  );
}
