import { motion, MotionProps } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import styled from 'styled-components';

type Props = {
  motionProps?: MotionProps;
  children: ReactNode;
  type: 'left' | 'right';
};
const variants = {
  initial: (direction: string) => {
    return direction === 'left'
      ? {
          opacity: 0,
        }
      : {
          opacity: 0,
        };
  },
  animate: {
    opacity: 1,
  },
  exit: (direction: string) => {
    return direction === 'left'
      ? {
          opacity: 0,
        }
      : {
          opacity: 0,
        };
  },
};
const SlideAnimationWrapper = styled.div`
  position: relative;
  height: 100%;
`;
const SlideAnimation = (props: Props) => {
  const { motionProps, children, type = 'left' } = props;
  const getAnimationProps = useMemo(() => {
    if (type === 'left') {
      return {
        key: 'left',
        custom: 'left',
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
        variants: variants,
        className: 'left-tab-col',
      };
    }
    return {
      key: 'right',
      custom: 'right',
      initial: 'initial',
      animate: 'animate',
      exit: 'exit',
      variants: variants,
      className: 'right-tab-col',
    };
  }, [type]);

  return (
    <SlideAnimationWrapper>
      <motion.div
        {...(getAnimationProps as any)}
        style={{ width: '100%', position: 'relative', height: '100%' }}
        transition={{ mass: 0.2, duration: 0.6 }}
        {...motionProps}
      >
        {children}
      </motion.div>
    </SlideAnimationWrapper>
  );
};

export default SlideAnimation;
