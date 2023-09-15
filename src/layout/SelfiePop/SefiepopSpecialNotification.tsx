import SpecialNotification from 'components/specific-notification';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { setEmailNotificationClosedByUser } from 'store/reducer/global';
type ISelfiepopSepcialNotificationProps = {
  showHeaderMenu?: boolean;
  user?: IUser;
  className?: string;
};
const SefiepopSpecialNotification = (
  props: ISelfiepopSepcialNotificationProps,
) => {
  const { showHeaderMenu, user, className } = props;
  const dispatch = useAppDispatch();

  const [notification, setNotification] = useState<boolean>(false);
  const eventData = useAppSelector((state) => state.eventSlice?.attendieInfo);
  const emailNotificationClosedByUser = useAppSelector(
    (state) => state.global.emailNotificationClosedByUser,
  );
  useEffect(() => {
    if (user?._id) {
      const isAllowNotification = !user?.isEmailVerified || !user?.idIsVerified;
      if (
        (user.userSetupStatus > 9 &&
          isAllowNotification &&
          !emailNotificationClosedByUser) ||
        eventData?._id
      ) {
        setNotification(true);
      } else {
        notification && setNotification(false);
      }
    }
    return () => {};
  }, [user?._id]);

  const showNotifications = user && showHeaderMenu && notification;
  return showNotifications ? (
    <SpecialNotification
      className={className}
      isOpen={notification}
      user={user}
      onClose={() => {
        dispatch(setEmailNotificationClosedByUser(true));
        setNotification(false);
      }}
    />
  ) : null;
};

export default SefiepopSpecialNotification;
