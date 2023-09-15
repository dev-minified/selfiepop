import { useEffect, useRef, useState } from 'react';

function useSingleAndDoubleClick(
  actionSimpleClick?: Function,
  actionDoubleClick?: Function,
  delay = 250,
) {
  const [click, setClick] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (click === 1) actionSimpleClick?.(ref.current);
      setClick(0);
    }, delay);

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (click === 2) actionDoubleClick?.(ref.current);

    return () => clearTimeout(timer);
  }, [actionDoubleClick, actionSimpleClick, click, delay]);

  return (props: any) => {
    ref.current = props;
    setClick((prev) => prev + 1);
  };
}

export default useSingleAndDoubleClick;
