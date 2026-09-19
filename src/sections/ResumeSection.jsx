import { ArrowUpRight } from '@phosphor-icons/react';
import SectionName from '../components/ui/SectionName';
import SectionTitle from '../components/ui/SectionTitle';
import AnimateInUp from '../components/ui/AnimateInUp';
import Marquee from '../components/ui/Marquee';
import StarburstIcon from '../assets/svg/StarburstIcon';
import { education } from '../data/education';
import { experience } from '../data/experience';
import { tools } from '../data/tools';
import { socials } from '../data/socials';

/* ─── Resume Item ─── */
function ResumeItem({ item, variant = 'education' }) {
  return (
    <>
      <div className="resume-divider" />
      <AnimateInUp>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6">
          <div className="md:col-span-2">
            <p className="text-body-base leading-relaxed text-brand-text-secondary dark:text-brand-text-dark-secondary">
              {item.period}
            </p>
          </div>
          <div className="md:col-span-5">
            <h4 className="font-semibold text-brand-text-primary dark:text-brand-text-dark-primary mb-1">
              {item.title}
            </h4>
            {variant === 'education' ? (
              <div>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-text-secondary dark:text-brand-text-dark-secondary underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:text-brand-accent hover:decoration-brand-accent transition-colors duration-300 inline-flex items-center gap-1"
                >
                  <span>{item.source}</span>
                  <ArrowUpRight size={13} className="opacity-70" />
                </a>
                {item.certificates && item.certificates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {item.certificates.map((cert, idx) => (
                      <a
                        key={idx}
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-light-surface dark:bg-white/5 border border-brand-border dark:border-white/10 text-brand-text-primary dark:text-brand-text-dark-primary hover:border-brand-accent hover:text-brand-accent transition-all duration-200 group"
                      >
                        <span>{cert.name}</span>
                        <ArrowUpRight
                          size={12}
                          className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-brand-text-secondary dark:text-brand-text-dark-secondary">
                in the{' '}
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:text-brand-accent hover:decoration-brand-accent transition-colors duration-300"
                >
                  {item.company}
                </a>{' '}
                {item.role}
              </p>
            )}
          </div>
          <div className="md:col-span-5">
            <p className="text-body-base leading-relaxed text-brand-text-secondary dark:text-brand-text-dark-secondary">
              {item.description}
            </p>
          </div>
        </div>
      </AnimateInUp>
    </>
  );
}

/* ─── Tool Card ─── */
function ToolCard({ tool, index }) {
  return (
    <AnimateInUp delay={index * 0.05}>
      <div className="glass-card p-4 md:p-6 flex flex-col items-center gap-3 group hover:border-brand-accent transition-all duration-300">
        <img
          src={tool.icon}
          alt={tool.name}
          className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <h6 className="text-caption uppercase font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary group-hover:text-brand-accent transition-colors duration-300">
          {tool.name}
        </h6>
      </div>
    </AnimateInUp>
  );
}


/* ─── Social Link ─── */
function SocialLink({ social }) {
  return (
    <li>
      <AnimateInUp>
        <div className="resume-divider" />
        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-5 group"
        >
          <h4 className="text-xl md:text-2xl font-semibold text-brand-text-primary dark:text-brand-text-dark-primary group-hover:text-brand-accent transition-colors duration-300">
            {social.name}
          </h4>
          <ArrowUpRight
            size={22}
            className="text-brand-text-secondary dark:text-brand-text-dark-secondary group-hover:text-brand-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
          />
        </a>
        <div className="resume-divider" />
      </AnimateInUp>
    </li>
  );
}

/* ═══════ MAIN RESUME SECTION ═══════ */
export default function ResumeSection() {
  return (
    <section id="resume" className="py-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-layout">
          <SectionName name="Resume" />

          <div className="section-content-col">
            <SectionTitle title="The digital journey" />

            {/* ── Education ── */}
            <div className="mb-section">
              <AnimateInUp>
                <p className="text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary mb-6">
                  My education
                </p>
              </AnimateInUp>
              {education.map((item) => (
                <ResumeItem key={item.id} item={item} variant="education" />
              ))}
              <div className="resume-divider" />
            </div>

            {/* ── Work Experience ── */}
            <div className="mb-section">
              <AnimateInUp>
                <p className="text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary mb-6">
                  Work experience
                </p>
              </AnimateInUp>
              {experience.map((item) => (
                <ResumeItem key={item.id} item={item} variant="experience" />
              ))}
              <div className="resume-divider" />
            </div>

            {/* ── Tools ── */}
            <div className="mb-section">
              <AnimateInUp>
                <p className="text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary mb-6">
                  My favourite tools
                </p>
              </AnimateInUp>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </div>
            </div>


          </div>

          <div className="section-aside-col" />
        </div>

        {/* ── Social Media (Full-Width) ── */}
        <div className="mt-block border-t border-brand-border dark:border-brand-border-dark pt-8">
          {/* Follow Me Marquee */}
          <Marquee speed={20} className="mb-12 text-brand-text-primary dark:text-brand-text-dark-primary">
            <div className="flex items-center gap-10 mx-10 text-display-md font-display italic opacity-30">
              <span>Follow me</span>
              <StarburstIcon className="w-10 h-10" />
              <span>Follow me</span>
              <StarburstIcon className="w-10 h-10" />
              <span>Follow me</span>
              <StarburstIcon className="w-10 h-10" />
            </div>
          </Marquee>

          <div className="max-w-3xl mx-auto">
            <AnimateInUp>
              <p className="text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary mb-4">
                Social media
              </p>
            </AnimateInUp>
            <ul className="space-y-0">
              {socials.map((social) => (
                <SocialLink key={social.id} social={social} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
