import { useState, useEffect, useRef } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { motion } from 'framer-motion';
import SectionName from '../components/ui/SectionName';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { portfolioItems } from '../data/portfolio';

const breakpointColumns = {
  default: 2,
  768: 1,
};

function PortfolioItem({ item, index, onClick }) {
  // ─── useRef: reference the figure for intersection observer ───
  const figureRef = useRef(null);

  // ─── useState: track if the card has entered the viewport ───
  const [hasAnimated, setHasAnimated] = useState(false);

  // ─── useEffect: observe when the card scrolls into view ───
  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={figureRef}
      className={`mb-6 group cursor-pointer transition-all duration-700 ease-out ${
        hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => onClick(index)}
    >
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h5 className="text-white font-medium text-lg">{item.title}</h5>
          <small className="text-white/70 text-sm">{item.category}</small>
        </div>
      </div>
      <figcaption className="mt-4 px-1">
        <h5 className="font-medium text-brand-text-primary dark:text-brand-text-dark-primary">
          {item.title}
          <small className="block text-sm text-brand-text-secondary dark:text-brand-text-dark-secondary mt-0.5 font-normal">
            {item.category}
          </small>
        </h5>
        <p className="text-body-sm text-brand-text-secondary dark:text-brand-text-dark-secondary mt-2 line-clamp-2">
          {item.description}
        </p>
      </figcaption>
    </figure>
  );
}

export default function PortfolioSection() {
  // ─── useState: track which image is open in the lightbox (-1 = closed) ───
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // ─── useRef: reference the gallery container ───
  const galleryRef = useRef(null);

  // ─── useState: track total number of images loaded ───
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // ─── useEffect: log when all gallery images have loaded ───
  useEffect(() => {
    if (imagesLoaded === portfolioItems.length) {
      console.log('All portfolio images loaded');
    }
  }, [imagesLoaded]);

  const slides = portfolioItems.map((item) => ({
    src: item.image,
    width: item.width,
    height: item.height,
    alt: item.title,
  }));

  return (
    <section id="portfolio" className="py-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-layout">
          <SectionName name="Portfolio" />

          <div className="section-content-col">
            <SectionTitle
              title="Design, tech & some magic"
              subtitle="I wonder if I've been changed in the night? Let me think. Was I the same when I got up this morning? I almost think I can remember feeling a little different."
            />

            {/* Masonry Gallery */}
            <div ref={galleryRef}>
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex gap-6 -ml-6"
                columnClassName="pl-6 bg-clip-padding"
              >
                {portfolioItems.map((item, index) => (
                  <PortfolioItem
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={setLightboxIndex}
                  />
                ))}
              </Masonry>
            </div>

            {/* Behance Link */}
            <div className="mt-12 flex justify-center">
              <Button variant="circleIcon" href="#">
                Behance profile
              </Button>
            </div>

            {/* Lightbox */}
            <Lightbox
              open={lightboxIndex >= 0}
              index={lightboxIndex}
              close={() => setLightboxIndex(-1)}
              slides={slides}
            />
          </div>

          <div className="section-aside-col" />
        </div>
      </div>
    </section>
  );
}
