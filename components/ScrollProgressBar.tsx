
import React, { useEffect, useState } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    setScrollTop(scrolled);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[1000]">
      <div
        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(197,164,126,0.7)]"
        style={{ width: `${scrollTop}%` }}
      ></div>
    </div>
  );
};

export default ScrollProgressBar;
