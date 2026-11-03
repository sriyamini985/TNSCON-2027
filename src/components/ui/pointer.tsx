import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

export interface PointerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  name?: string;
  color?: string;
  className?: string;
  hideDefaultCursor?: boolean;
}

export const Pointer: React.FC<PointerProps> = ({
  children,
  name,
  color = '#003399',
  className = '',
  hideDefaultCursor = false,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth mouse motion values with spring physics
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const targetElement = containerRef.current?.parentElement;
    if (!targetElement) return;

    // Ensure parent element has relative positioning for proper coordinate calculation
    const computed = window.getComputedStyle(targetElement);
    if (computed.position === 'static') {
      targetElement.style.position = 'relative';
    }

    if (hideDefaultCursor) {
      targetElement.style.cursor = 'none';
    }

    // Check if element is already hovered on mount
    try {
      if (targetElement.matches(':hover')) {
        setIsVisible(true);
      }
    } catch {
      // Ignored in SSR / test environments
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = targetElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = targetElement.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    targetElement.addEventListener('mousemove', handleMouseMove);
    targetElement.addEventListener('mouseenter', handleMouseEnter);
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      targetElement.removeEventListener('mousemove', handleMouseMove);
      targetElement.removeEventListener('mouseenter', handleMouseEnter);
      targetElement.removeEventListener('mouseleave', handleMouseLeave);
      if (hideDefaultCursor) {
        targetElement.style.cursor = '';
      }
    };
  }, [mouseX, mouseY, isVisible, hideDefaultCursor]);

  const badgeText = name || (typeof children === 'string' ? children : null);
  const customChild = typeof children !== 'string' && React.isValidElement(children) ? children : null;

  return (
    <div ref={containerRef} className="contents pointer-events-none select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`pointer-events-none absolute top-0 left-0 z-50 flex items-center gap-1.5 select-none ${className}`}
            style={{
              x: smoothX,
              y: smoothY,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            {...props}
          >
            {/* Animated SVG Cursor Arrow */}
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="1"
              viewBox="0 0 16 16"
              className="h-4 w-4 drop-shadow-md -rotate-45"
              style={{ color }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.52 15.419a.5.5 0 0 1-.916-.007l-2.72-6.526-6.526-2.72a.5.5 0 0 1-.007-.916l12.68-5.665a.5.5 0 0 1 .557.103z" />
            </svg>

            {/* Interactive Floating Label Badge */}
            {badgeText && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, x: -4 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-md flex items-center gap-1 whitespace-nowrap"
                style={{ backgroundColor: color }}
              >
                <span>{badgeText}</span>
              </motion.div>
            )}

            {/* Custom React Element child if provided */}
            {customChild}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pointer;
