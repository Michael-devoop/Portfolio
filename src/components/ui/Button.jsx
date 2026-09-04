import { ArrowRight, ArrowDownRight, ArrowUpRight } from '@phosphor-icons/react';

const variants = {
  default: 'relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-accent text-white font-medium text-sm uppercase tracking-wider rounded-full overflow-hidden group transition-all duration-300 hover:bg-brand-accent-hover hover:shadow-lg hover:shadow-brand-accent/20',
  line: 'inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-brand-text-primary dark:text-brand-text-dark-primary border-b border-brand-border dark:border-brand-border-dark pb-1 transition-all duration-300 hover:border-brand-accent hover:text-brand-accent dark:hover:text-brand-accent',
  lineSmall: 'inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-text-primary dark:text-brand-text-dark-primary border-b border-brand-border dark:border-brand-border-dark pb-1 transition-all duration-300 hover:border-brand-accent hover:text-brand-accent dark:hover:text-brand-accent',
  circleIcon: 'inline-flex items-center gap-4 text-sm font-medium uppercase tracking-wider text-brand-text-primary dark:text-brand-text-dark-primary group transition-all duration-300',
};

const iconMap = {
  'arrow-right': ArrowRight,
  'arrow-down-right': ArrowDownRight,
  'arrow-up-right': ArrowUpRight,
};

export default function Button({
  children,
  variant = 'default',
  icon,
  iconPosition = 'right',
  href,
  className = '',
  ...props
}) {
  const baseClass = variants[variant] || variants.default;
  const IconComponent = icon ? iconMap[icon] : null;

  const content = (
    <>
      {variant === 'default' && (
        <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
      )}
      {iconPosition === 'left' && IconComponent && (
        <IconComponent size={18} className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5" />
      )}
      <span className="relative z-10">{children}</span>
      {iconPosition === 'right' && IconComponent && (
        <IconComponent size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
      {variant === 'circleIcon' && (
        <span className="relative flex items-center justify-center w-12 h-12 rounded-full border border-brand-border dark:border-brand-border-dark transition-all duration-300 group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-white">
          <ArrowRight size={18} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseClass} ${className}`} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {content}
    </button>
  );
}
