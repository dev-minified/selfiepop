import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { setChatLayoutHeight } from 'util/index';
import { getPopByName } from '../../../api/Pop';
import Services from './components/Services';

const PublicServices: React.FC<{
  user?: any;
  isPreivew?: boolean;
  className?: string;
}> = ({ user: publicUser, isPreivew = false, className }) => {
  const history = useHistory();
  const { user, loggedIn } = useAuth();
  const { username, popslug } = useParams<{
    username: string;
    popslug: string;
  }>();
  const [pop, setPop] = useState<any>({});
  const [ownProfile, setOwnProfile] = useState<boolean>(false);
  const emailNotificationClosedByUser = useAppSelector(
    (state) => state.global.emailNotificationClosedByUser,
  );
  const { previewPop } = useAppSelector((state) => state.popslice);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 700);
  }, []);

  useEffect(() => {
    setChatLayoutHeight({ className: 'chat_widget_height' });
  }, [emailNotificationClosedByUser]);
  useEffect(() => {
    if (publicUser?._id) {
      const isSameUser = user?._id && user?._id === publicUser?._id;
      const isAllowToPurchse = user?._id ? user?.allowPurchases : true;
      if (!isSameUser) {
        if (
          !isAllowToPurchse ||
          !publicUser?.allowSelling ||
          !publicUser?.idIsVerified
        ) {
          return history.replace(`/${username}`);
        }
      }
    }
  }, [user, publicUser]);

  useEffect(() => {
    if (isPreivew) {
      setOwnProfile(true);
      setPop({ ...(previewPop?.popLinksId || {}) });
    } else if (!!username && !!popslug) {
      getPopData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewPop]);

  const getPopData = async () => {
    const popData = await getPopByName(username, popslug).catch((e: Error) =>
      console.log(e),
    );

    if (!popData) {
      return history.replace('/404');
    }

    if (!popData.owner?.isActiveProfile) {
      if (user?._id !== popData.owner?._id) {
        history.replace('/');
      }
    }

    // check if the user is need this own profile
    if (loggedIn && user?._id === popData.owner?._id) {
      setOwnProfile(true);
    }

    if (popData?.owner) {
      popData.owner.themeName = popData.owner.themeColor?.colorSetName
        .toLowerCase()
        .replace(' ', '-');
      popData.owner.themeNumber = 1;
      if (popData.owner.themeName === 'purple-haze')
        popData.owner.themeNumber = 2;
      else if (popData.owner.themeName === 'sedona')
        popData.owner.themeNumber = 3;
    }

    setPop(popData);
  };
  return (
    <Services
      user={publicUser}
      className={className}
      value={pop}
      isOwnProfile={ownProfile}
      isPreivew={isPreivew}
    />
  );
};

export default PublicServices;
