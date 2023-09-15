import { useEffect, useState } from 'react';
let timeout: NodeJS.Timeout;
type IAnimationEndHook = {
  isAnimationEnd?: boolean;
  callback?: (...args: any) => any;
  animationTiming?: number;
  otherProps?: Record<string, any> | any;
};
export const useAnimationEndHook = ({
  isAnimationEnd,
  callback,
  otherProps,
  animationTiming = 1000,
}: IAnimationEndHook) => {
  const [loading, setLoading] = useState(isAnimationEnd);

  useEffect(() => {
    if (typeof isAnimationEnd === 'undefined') {
      setLoading(true);
    } else if (isAnimationEnd) {
      clearTimeout(timeout);
      setLoading(isAnimationEnd);
      callback?.();
    } else {
      timeout = setTimeout(() => {
        setLoading(true);
        callback?.();
      }, animationTiming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimationEnd, otherProps]);
  return { isAnimationEnd: loading };
};
