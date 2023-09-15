import { useEffect, useRef, useState } from 'react';

function useDropDown(
  initialIsVisible?: any,
  toggle = true,
  options: { onCloseCallback?: () => void } = {},
) {
  const { onCloseCallback } = options;
  const [isVisible, setIsVisible] = useState(initialIsVisible || false);
  const ref: any = useRef(null);

  const handleClick = (event: any) => {
    // ref?.current?.stopPropagation();
    // ref?.current?.preventDefault();
    if (ref.current && !ref.current.contains(event.target)) {
      if (isVisible) {
        onCloseCallback && onCloseCallback();
        setIsVisible(false);
      }
      return null;
    }
    if (toggle) {
      setIsVisible((state: any) => {
        return !state;
      });
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return { ref, isVisible, setIsVisible };
}

export default useDropDown;
