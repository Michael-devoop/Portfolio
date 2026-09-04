import Marquee from '../ui/Marquee';
import StarburstIcon from '../../assets/svg/StarburstIcon';
import { ArrowUp } from '@phosphor-icons/react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-brand-border dark:border-brand-border-dark">
      {/* Footer Marquee */}
      <div className="py-8 border-b border-brand-border dark:border-brand-border-dark">
        <Marquee speed={20} className="text-brand-text-primary dark:text-brand-text-dark-primary">
          <a
            href="mailto:example@example.com?subject=Message%20from%20your%20site"
            className="flex items-center gap-8 mx-8 text-display-md font-display italic hover:text-brand-accent transition-colors duration-300"
          >
            <span>Got an idea?</span>
            <StarburstIcon className="w-10 h-10 opacity-30" />
            <span>Got an idea?</span>
            <StarburstIcon className="w-10 h-10 opacity-30" />
            <span>Got an idea?</span>
            <StarburstIcon className="w-10 h-10 opacity-30" />
          </a>
        </Marquee>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <p className="text-body-sm text-brand-text-secondary dark:text-brand-text-dark-secondary">
          © {new Date().getFullYear()} Blayden. All rights reserved.
        </p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-body-sm font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary hover:text-brand-accent transition-colors duration-300 group"
        >
          <span>Back to top</span>
          <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
