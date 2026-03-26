import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Record<string, string | number> | Record<string, string | number>[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 100,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '-50px',
  animationFrom,
  animationTo,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: rootMargin as any, amount: threshold });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  const defaultFrom = useMemo(() => ({
    filter: 'blur(10px)',
    opacity: 0,
    y: direction === 'top' ? -20 : 20,
  }), [direction]);

  const defaultTo = useMemo(() => ({
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
  }), []);

  const from = animationFrom || defaultFrom;
  const to = Array.isArray(animationTo) ? animationTo[animationTo.length - 1] : (animationTo || defaultTo);

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={from}
          animate={hasAnimated ? to : from}
          transition={{
            duration: stepDuration,
            delay: i * (delay / 1000),
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            display: 'inline-block',
            willChange: 'transform, filter, opacity',
          }}
        >
          {el}{animateBy === 'words' && i < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
