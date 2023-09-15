import { useEffect, useState } from 'react';
import { isDesktop, isMobileOnly } from 'react-device-detect';
import { useHistory } from 'react-router-dom';

export default function useBrowserBack() {
  const [pressed, setPressed] = useState(false);
  const [direction, setDirection] = useState<string>('');
  const [locationKeys, setLocationKeys] = useState<any>([]);
  // const [event, setEvent] = useState<any>(null);
  const history = useHistory();
  // useEffect(() => {
  //   window.onpopstate = (e: any) => {
  //     setPressed(true);
  //     setEvent(e);
  //   };
  // });
  useEffect(() => {
    history.listen((location) => {
      if (history.action === 'PUSH') {
        setPressed(true);
        setDirection('next');
        setLocationKeys([location.key]);
      }

      if (history.action === 'POP') {
        setPressed(true);
        if (locationKeys[1] === location.key) {
          setDirection('next');
          // eslint-disable-next-line
          setLocationKeys(([_, ...keys]: any) => keys);
          // Handle forward event
        } else {
          // eslint-disable-next-line
          setLocationKeys((keys: any) => [location.key, ...keys]);

          setDirection('prev');
          // Handle back event
        }
      }
    });
  }, []);
  return { pressed, isDesktop, direction, isMobileOnly, history };
}
