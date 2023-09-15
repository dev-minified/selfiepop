import { useEffect } from 'react';

function useKeyPressListener(callback?: Function, keys: string[] = ['Enter']) {
  const handleClick = (e: any) => {
    if (keys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      if (callback) callback();
    }
  };

  useEffect(() => {
    document.addEventListener('keypress', handleClick);
    return () => {
      document.removeEventListener('keypress', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);
}

export default useKeyPressListener;
