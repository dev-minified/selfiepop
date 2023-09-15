import { setTheme, toggleTheme } from 'store/reducer/Apptheme';
import { setBodyThemeClass, toogleBodyThemeClass } from 'util/index';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

const useAppTheme = () => {
  const theme = useAppSelector((state) => state.appTheme).apptheme;

  const dispatch = useAppDispatch();
  const setAppTheme = (theme: Apptheme) => {
    setBodyThemeClass(theme?.mode);
    dispatch(setTheme(theme));
  };
  const toggleAppTheme = () => {
    toogleBodyThemeClass();
    dispatch(toggleTheme());
  };
  return { theme, setAppTheme, toggleAppTheme, mode: theme?.mode };
};

export default useAppTheme;
