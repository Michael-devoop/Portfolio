export default function Logo() {
  return (
    <div className="fixed top-6 left-6 z-50">
      <a href="#home" className="flex items-center gap-3 group">
        {/* Stylized "M" logo */}
        <div className="relative w-10 h-10 rounded-xl bg-brand-dark dark:bg-brand-light-surface flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
          <span className="text-xl font-bold text-brand-light-surface dark:text-brand-dark tracking-tighter leading-none">
            M
          </span>
          {/* Accent dot */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-accent" />
        </div>
        <span className="text-lg font-medium text-brand-text-primary dark:text-brand-text-dark-primary tracking-tight hidden sm:inline">
          Michael<span className="text-brand-accent">.</span>
        </span>
      </a>
    </div>
  );
}
