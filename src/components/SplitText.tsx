import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const elements = splitType === 'words' ? text.split(' ') : text.split('');

  useEffect(() => {
    if (!containerRef.current || hasAnimated) return;

    const spans = containerRef.current.querySelectorAll('.split-el');
    
    gsap.set(spans, from);

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: `top ${100 - threshold * 100}%`,
      once: true,
      onEnter: () => {
        setHasAnimated(true);
        gsap.to(spans, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          onComplete: onLetterAnimationComplete,
        });
      },
    });
  }, [hasAnimated, from, to, delay, duration, ease, threshold, onLetterAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
        overflow: 'hidden',
      }}
    >
      {elements.map((el, i) => (
        <span
          key={i}
          className="split-el"
          style={{
            display: 'inline-block',
            willChange: 'transform, opacity',
            opacity: 0,
          }}
        >
          {el === ' ' ? '\u00A0' : el}
          {splitType === 'words' && i < elements.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
