import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smiley } from '@phosphor-icons/react';
import SectionName from '../components/ui/SectionName';
import SectionTitle from '../components/ui/SectionTitle';
import AnimateInUp from '../components/ui/AnimateInUp';
import { contactInfo } from '../data/contact';

export default function ContactSection() {
  // ─── useState: controlled form inputs ───
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  // ─── useState: form submission state ───
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ─── useState: form validation errors ───
  const [errors, setErrors] = useState({});

  // ─── useRef: reference to the form element for reset ───
  const formRef = useRef(null);

  // ─── useRef: reference to first input for auto-focus ───
  const nameInputRef = useRef(null);

  // ─── useEffect: auto-focus the name input when section scrolls into view ───
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && nameInputRef.current) {
          // Don't actually steal focus, just mark it ready
          nameInputRef.current.classList.add('ring-1', 'ring-brand-accent/30');
          setTimeout(() => {
            nameInputRef.current?.classList.remove('ring-1', 'ring-brand-accent/30');
          }, 2000);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── useEffect: reset form after 5 seconds of showing success ───
  useEffect(() => {
    if (!isSubmitted) return;

    const timer = setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
    }, 5000);

    return () => clearTimeout(timer);
  }, [isSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitted(true);
  };

  const inputClasses = (fieldName) =>
    `w-full px-5 py-4 rounded-2xl border ${
      errors[fieldName]
        ? 'border-red-400 dark:border-red-500'
        : 'border-brand-border dark:border-brand-border-dark'
    } bg-transparent text-brand-text-primary dark:text-brand-text-dark-primary placeholder:text-brand-text-secondary/50 dark:placeholder:text-brand-text-dark-secondary/50 focus:outline-none focus:border-brand-accent transition-colors duration-300`;

  return (
    <section id="contact" className="py-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="section-layout">
          <SectionName name="Contact" />

          <div className="section-content-col">
            <SectionTitle
              title="Just say hello!"
              subtitle="Want to know more about me, tell me about your project or just to say hello? Drop me a line and I'll get back as soon as possible."
            />

            {/* Contact Form */}
            <div className="relative mb-block" ref={formRef}>
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center"
                  >
                    <Smiley size={64} weight="thin" className="text-brand-accent mx-auto mb-4" />
                    <p className="text-2xl font-display font-semibold text-brand-text-primary dark:text-brand-text-dark-primary mb-2">
                      Done!
                    </p>
                    <span className="text-body-base text-brand-text-secondary dark:text-brand-text-dark-secondary">
                      Thanks for your message. I'll get back as soon as possible.
                    </span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <AnimateInUp>
                        <div>
                          <input
                            ref={nameInputRef}
                            type="text"
                            name="name"
                            placeholder="Your name*"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClasses('name')}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-xs mt-1 ml-2">{errors.name}</p>
                          )}
                        </div>
                      </AnimateInUp>
                      <AnimateInUp delay={0.05}>
                        <input
                          type="text"
                          name="company"
                          placeholder="Company name"
                          value={formData.company}
                          onChange={handleChange}
                          className={inputClasses('company')}
                        />
                      </AnimateInUp>
                      <AnimateInUp delay={0.1}>
                        <div>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email*"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClasses('email')}
                          />
                          {errors.email && (
                            <p className="text-red-400 text-xs mt-1 ml-2">{errors.email}</p>
                          )}
                        </div>
                      </AnimateInUp>
                      <AnimateInUp delay={0.15}>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses('phone')}
                        />
                      </AnimateInUp>
                    </div>
                    <AnimateInUp delay={0.2} className="mt-4 md:mt-6">
                      <div>
                        <textarea
                          name="message"
                          placeholder="A few words about your project*"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className={`${inputClasses('message')} resize-none`}
                        />
                        {errors.message && (
                          <p className="text-red-400 text-xs mt-1 ml-2">{errors.message}</p>
                        )}
                      </div>
                    </AnimateInUp>
                    <AnimateInUp delay={0.25} className="mt-6">
                      <button
                        type="submit"
                        className="relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-accent text-white font-medium text-sm uppercase tracking-wider rounded-full overflow-hidden group transition-all duration-300 hover:bg-brand-accent-hover hover:shadow-lg hover:shadow-brand-accent/20"
                      >
                        <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                        <span className="relative z-10">Submit request</span>
                      </button>
                    </AnimateInUp>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.locations.map((loc) => (
                <AnimateInUp key={loc.id}>
                  <p className="text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary mb-2">
                    Location
                  </p>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm leading-relaxed text-brand-text-primary dark:text-brand-text-dark-primary hover:text-brand-accent transition-colors duration-300 underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:decoration-brand-accent"
                  >
                    {loc.city}
                    <br />
                    {loc.zip}
                  </a>
                </AnimateInUp>
              ))}
              <AnimateInUp>
                <p className="text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary mb-2">
                  Phone
                </p>
                <div className="space-y-1">
                  {contactInfo.phones.map((p) => (
                    <a
                      key={p.id}
                      href={p.href}
                      className="block text-sm text-brand-text-primary dark:text-brand-text-dark-primary hover:text-brand-accent transition-colors duration-300 underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:decoration-brand-accent"
                    >
                      {p.number}
                    </a>
                  ))}
                </div>
              </AnimateInUp>
              <AnimateInUp>
                <p className="text-caption uppercase tracking-[0.15em] font-medium text-brand-text-secondary dark:text-brand-text-dark-secondary mb-2">
                  Email
                </p>
                <div className="space-y-1">
                  {contactInfo.emails.map((em) => (
                    <a
                      key={em.id}
                      href={em.href}
                      className="block text-sm text-brand-text-primary dark:text-brand-text-dark-primary hover:text-brand-accent transition-colors duration-300 underline underline-offset-4 decoration-brand-border dark:decoration-brand-border-dark hover:decoration-brand-accent"
                    >
                      {em.address}
                    </a>
                  ))}
                </div>
              </AnimateInUp>
            </div>
          </div>

          <div className="section-aside-col" />
        </div>
      </div>
    </section>
  );
}
