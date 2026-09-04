import { ArrowDownRight } from '@phosphor-icons/react';
import AnimateInUp from './AnimateInUp';

export default function SectionName({ name }) {
  return (
    <div className="section-name-col">
      <div className="xl:sticky xl:top-8 pb-6 xl:pb-0">
        <AnimateInUp>
          <span className="inline-flex items-center gap-2 text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary">
            <span>{name}</span>
            <ArrowDownRight size={14} weight="bold" />
          </span>
        </AnimateInUp>
      </div>
    </div>
  );
}
