import { useContext } from 'react';
import { TwoPanelLayoutContext } from '../context/TwoPanelLayout';

const useControllTwopanelLayoutView = () => {
  return useContext(TwoPanelLayoutContext);
};

export default useControllTwopanelLayoutView;
