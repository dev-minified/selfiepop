import { createContext, useCallback, useState } from 'react';

export interface ITwoPanelLayout {
  activeView: 'left' | 'right';
  setActiveView: React.Dispatch<React.SetStateAction<'left' | 'right'>>;
  showRightView: () => void;
  showLeftView: () => void;
}

export const TwoPanelLayoutContext = createContext<ITwoPanelLayout>({
  activeView: 'left',
  setActiveView: () => {},
  showRightView: () => {},
  showLeftView: () => {},
});

const TwoPanelLayoutProvider: React.FC<any> = (props) => {
  const [activeView, setActiveView] = useState<'left' | 'right'>('left');
  const showRightView = useCallback(() => {
    setActiveView('right');
  }, []);
  const showLeftView = useCallback(() => {
    setActiveView('left');
  }, []);
  return (
    <TwoPanelLayoutContext.Provider
      value={{ activeView, setActiveView, showLeftView, showRightView }}
    >
      {props.children}
    </TwoPanelLayoutContext.Provider>
  );
};

export default TwoPanelLayoutProvider;
