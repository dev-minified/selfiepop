import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { ReactNode, useCallback, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { matchPath } from 'react-router-dom';
import { setGuestUser, setGuestUserTokens } from 'store/reducer/checkout';
import { setPublicUser } from 'store/reducer/global';
import 'styles/public.css';
import { useAnalytics } from 'use-analytics';

import { fetchUserByName } from '../api/User';
import {
  checkifGuestOrloggedIn,
  parseQuery,
  removeLocalStorage,
} from '../util';
import PublicLayout from './public';

const PublicUser: React.FC<{
  showFooter?: boolean;
  hideTopFooter?: boolean;
  layoutProps?: { showHeader?: boolean; showHeaderMenu?: boolean };
  children?: ReactNode;
}> = (props) => {
  const { children } = props;
  const history = useHistory();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { themeId, token } = parseQuery(location.search);
  const dispatch = useAppDispatch();
  const analytics = useAnalytics();
  const user = useAppSelector((state) => state.global?.publicUser);
  const { setLoading } = useRequestLoader();
  const { user: authUser } = useAuth();

  const getUser = useCallback(async () => {
    setLoading(true);
    const userData = await fetchUserByName(
      username,
      { themeId, token },
      {},
      false,
    ).catch((e: Error) => {
      setLoading(false);
      console.log(e);
    });
    if (!userData) {
      setLoading(false);
      return history.push('/404');
    }
    let dispatchUser = userData;
    const isUsersEuqal = authUser?._id === userData?._id;
    const isPreview = authUser?._id && userData?._id && isUsersEuqal;
    setLoading(false);
    if (isPreview) {
      dispatchUser = authUser;
    }
    dispatch(setPublicUser(dispatchUser));
    if (!isPreview) {
      setLoading(true);
      checkifGuestOrloggedIn({
        loggedUser: authUser,
        publicUser: userData,
      }).then((uUser: any) => {
        if (uUser?.user) {
          const lUser = { ...(uUser?.user || {}) };
          if (!uUser.isLoggedIn) {
            dispatch(setGuestUser(lUser));
            dispatch(
              setGuestUserTokens({
                refreshToken: lUser.refreshToken,
                token: lUser.token,
              }),
            );
            setLoading(false);
          } else {
            setLoading(false);
          }
          const isAlreadyexist =
            analytics.storage.getItem('__user_id') !== lUser?.data?._id;
          if (isAlreadyexist) {
            analytics.identify(lUser?.data?._id);
          }
          analytics.track('public_profile_visit', {
            userProfileViewed: userData?._id,
          });
        }
      });
      setLoading(false);
    }
  }, [dispatch, history, themeId, token, username, authUser?._id]);

  useEffect(() => {
    !!username && getUser();
    removeLocalStorage('welcomeModalClosedByUser');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const popslugMatch = matchPath(history.location.pathname, {
    path: '/:username/:popslug',
    exact: true,
  });

  // const popslugSubMatch = matchPath(history.location.pathname, {
  //   path: '/:username/:popslug/giftinvitation',
  //   exact: true,
  // });
  const purchaseMatch = matchPath(history.location.pathname, {
    path: '/:username/purchase',
    exact: false,
  });

  return (
    <div
      className={
        popslugMatch || purchaseMatch /* || popslugSubMatch */
          ? 'public__layout'
          : ''
      }
    >
      <PublicLayout theme={user?.userThemeId} user={user} {...props}>
        {children}
      </PublicLayout>
    </div>
  );
};

export default PublicUser;
