import { useEffect, useRef, useState } from 'react';

export function useReveal(options = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Toggle both ways (rather than unobserving after the first reveal)
        // so the animation replays every time a section enters view again —
        // scrolling down OR back up.
        setVisible(entry.isIntersecting);
      });
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}
