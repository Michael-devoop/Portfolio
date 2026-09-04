import RevealText from './RevealText';
import AnimateInUp from './AnimateInUp';

export default function SectionTitle({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-block ${className}`}>
      <RevealText
        text={title}
        as="h2"
        className="font-display text-display-lg text-brand-text-primary dark:text-brand-text-dark-primary text-balance"
      />
      {subtitle && (
        <AnimateInUp delay={0.2}>
          <p className="mt-6 text-body-lg text-brand-text-secondary dark:text-brand-text-dark-secondary max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </AnimateInUp>
      )}
    </div>
  );
}
