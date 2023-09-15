import { IBottomNavType, onToggleBottomNav } from 'store/reducer/bottomNav';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export default function useBottomNavToggler() {
  const dispatch = useAppDispatch();
  const { showNav = true, applyClass = false } = useAppSelector(
    (state) => state.bottomNav,
  );

  const onBottomNavToggle = (props: IBottomNavType) => {
    dispatch(onToggleBottomNav({ ...props }));
  };

  return { onBottomNavToggle, showNav, applyClass };
}
