import { createTheme, updateTheme } from 'api/theme';
import { update } from 'api/User';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import React, { ReactNode, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useHistory } from 'react-router';
import { setApplyThemeModal } from 'store/reducer/global';
import { setCurrentTheme, setThemes } from 'store/reducer/theme';
import {
  getLocalStorage,
  getUserSetupUri,
  removeLocalStorage,
} from 'util/index';

const ThemeSelector: React.FC<{
  isOnboarding?: boolean;
  children?: ReactNode;
}> = (props) => {
  const { children, ...rest } = props;
  const { showLeftView } = useControllTwopanelLayoutView();

  const { user, setUser } = useAuth();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const userThemes = useAppSelector((state) => state.theme?.allthemes);
  const current = useAppSelector((state) => state.theme?.current);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const onApplyHandler = async () => {
    setIsApplying(true);
    if (rest.isOnboarding) {
      const isNextPasswordPage =
        getLocalStorage('setPasswordOnOnboarding', false) === 'yes';
      const requests = [];
      requests.push(
        update({
          userSetupStatus: isNextPasswordPage ? 3 : 10,
          isActiveProfile: isNextPasswordPage ? false : true,
        }),
      );
      if (current?._id) {
        requests.push(
          createTheme({
            ...current,
            isSystemTheme: false,
            isPublished: false,
            isDefault: false,
            isActive: true,
            baseURL: `${window.location.host}/${user.username}`,
            categoryId: (current?.categoryId as any)?._id || '',
          }),
        );
      }

      await Promise.all(requests)
        .then(([userRes, themeRes]) => {
          if (themeRes) {
            dispatch(setThemes([...userThemes, themeRes?.theme]));
            setUser({ ...userRes.data, userThemeId: themeRes?.theme });
          } else {
            setUser({ ...userRes.data });
          }
          if (isNextPasswordPage) {
            removeLocalStorage('setPasswordOnOnboarding');
            history.push(getUserSetupUri(3));
          } else {
            history.push('/my-profile');
          }
        })
        .catch(console.log);
    } else {
      current?._id &&
        (await updateTheme(current._id, {
          ...current,
          isActive: true,
          baseURL: `${window.location.host}/${user.username}`,
        })
          .then((res) => {
            dispatch(
              setThemes(
                userThemes.map((item) =>
                  item._id === res?.theme?._id
                    ? res.theme
                    : { ...item, isActive: false },
                ),
              ),
            );
            setSelectedTheme(res.theme);
            setUser({ ...user, userThemeId: res.theme });
            setIsApplyModalOpen(false);
          })
          .catch(console.log));
    }
    setIsApplying(false);
    showLeftView();
  };

  const onRevertHandler = () => {
    if (rest.isOnboarding && isMobileOnly) {
      showLeftView();
      return;
    }
    setSelectedTheme(userThemes.find((theme) => theme.isActive));
    setIsApplyModalOpen(false);
    showLeftView();
  };

  const openApplyModal = (value: boolean) => {
    if (isMobileOnly || rest.isOnboarding) {
      setIsApplyModalOpen(value);
    } else {
      dispatch(setApplyThemeModal({ active: value }));
    }
  };

  const setSelectedTheme = (theme?: ITheme) => {
    dispatch(setCurrentTheme(theme));
  };

  return React.cloneElement(children as any, {
    ...rest,
    isApplyModalOpen,
    setIsApplyModalOpen: openApplyModal,
    selectedTheme: current,
    setSelectedTheme,
    isThemeApplying: isApplying,
    onApplyTheme: onApplyHandler,
    onRevertTheme: onRevertHandler,
  });
};

export default ThemeSelector;
