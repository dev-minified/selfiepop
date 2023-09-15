import { motion, Variants } from 'framer-motion';
import React, { ReactNode, useRef, useState } from 'react';
import { useHistory } from 'react-router';

const rtl = {
  pageInitial: {
    opacity: 0,
    left: '660px',
  },
  pageAnimate: {
    opacity: 1,
    left: '0',
  },
  pageExit: {
    opacity: 0,
    left: '-660px',
    position: 'absolute',
  },
};
const ltr = {
  pageInitial: {
    opacity: 0,
    left: '-660px',
  },
  pageAnimate: {
    opacity: 1,
    left: '0',
  },
  pageExit: {
    opacity: 0,
    left: '660px',
    position: 'absolute',
  },
};

export const Transition = {
  // type: 'spring',
  mass: 0.2,
  duration: 0.6,
};

const PageTransition: React.FC<{
  variants?: Variants;
  motionKey?: string;
  onAnimationEnd?: boolean;
  children?: ReactNode;
  className?: string;
}> = ({ children, variants, motionKey, onAnimationEnd = false, ...props }) => {
  const { action } = useHistory();
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const trasition = action === 'POP' ? ltr : rtl;
  return (
    <div
      className="animated-block"
      style={{ position: 'relative', height: '100%' }}
      key={motionKey}
    >
      <motion.div
        className="animated-block-area"
        ref={ref}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={variants || (trasition as any)}
        style={{ width: '100%', position: 'relative', height: '100%' }}
        transition={Transition}
        {...(onAnimationEnd
          ? {
              onAnimationComplete: () => {
                setIsAnimationComplete(true);
              },
            }
          : {})}
      >
        <React.Suspense fallback={<div>Loading...</div>}>
          {React.cloneElement(children as any, {
            ...props,
            isAnimationComplete,
          })}
        </React.Suspense>
      </motion.div>
    </div>
  );
};

export default PageTransition;
