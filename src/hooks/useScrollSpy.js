import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds, offset = 100) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When near the top, always activate the first section (home)
      if (currentScrollY < 120) {
        setActiveId(sectionIds[0]);
        return;
      }

      // Check if user scrolled to the bottom of the page
      if (
        window.innerHeight + Math.ceil(currentScrollY) >=
        document.documentElement.scrollHeight - 50
      ) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        return;
      }

      const scrollPosition = currentScrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          const top = rect.top + currentScrollY;
          if (top <= scrollPosition) {
            setActiveId(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}
