import { Calendar, FireIcon, SalespurchasesChat } from 'assets/svgs';
import SliderTab from 'components/SliderTab';
import ListItem from 'components/UserList/ListItem';
import { useIsPresent } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useRequestLoader from 'hooks/useRequestLoader';
import { setTwoPanelLayoutHeight } from 'layout/TwoPanelLayout';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { setHeaderTitle, setHeaderUrl } from 'store/reducer/headerState';
import { getManagedUserDetails } from 'store/reducer/managed-users';
import styled from 'styled-components';
import { getSessionStorage } from 'util/index';

type Props = {
  className?: string;
};

const AccountDetails: React.FC<Props> = (props) => {
  const { className } = props;

  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { withLoader } = useRequestLoader();
  const isPresent = useIsPresent();

  const user = useAppSelector((state) => state.managedUsers.item);
  const managedUsers = useAppSelector((state) => state.managedUsers.item);

  useEffect(() => {
    const MyProfile = getSessionStorage('my-profile');
    withLoader(dispatch(getManagedUserDetails({ userId: `${id}` })));
    dispatch(
      setHeaderUrl(
        MyProfile ? `/my-profile/managed-accounts` : `/managed-accounts`,
      ),
    );
    setTwoPanelLayoutHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && isPresent) {
      dispatch(setHeaderTitle(`${user?.pageTitle ?? 'Incognito User'}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const allowMessage =
    managedUsers?.permissions?.status === 'active' &&
    managedUsers?.permissions?.allowMessage;
  const allowContent =
    managedUsers?.permissions?.status === 'active' &&
    managedUsers?.permissions?.allowContent;
  const applyText = `Schedule a ${allowContent ? 'Post' : ''} ${
    allowContent && allowMessage ? '/' : ''
  } ${allowMessage ? 'Message' : ''}`;
  return (
    <div className={`${className} managed-account-details`}>
      {user && (
        <ListItem
          title={`${user?.pageTitle ?? 'Incognito User'}`}
          image={user?.profileImage}
          isOnline={user?.isOnline}
          onItemClick={() => {
            window.open(`/${user.username}`, '_blank');
          }}
        />
      )}
      {(allowMessage || allowContent) && (
        <SliderTab
          title="Subscribers"
          Icon={<span>{user?.subscription}</span>}
          extra={
            <div className="unread-msg">
              <SalespurchasesChat />
              <span className="number">{user?.unread}</span>
            </div>
          }
          onClickTab={() => {
            history.push(`/managed-accounts/${id}/subscribers`);
          }}
        />
      )}
      <SliderTab
        title="Membership Levels "
        Icon={<FireIcon color="white" />}
        onClickTab={() => {
          history.push(`/managed-accounts/${id}/membership-levels`);
        }}
      />
      <SliderTab
        title={applyText}
        Icon={<Calendar />}
        onClickTab={() => {
          history.push(`/managed-accounts/${id}/schedule`);
        }}
      />
      {/* <SliderTab
        title="Rules"
        Icon={<Calendar />}
        onClickTab={() => {
          history.push(`/managed-accounts/${id}/rules`);
        }}
      /> */}
    </div>
  );
};

export default styled(AccountDetails)`
  .img-link {
    background-color: var(--pallete-primary-main) !important;
    color: #fff;
  }

  .chat-user-area {
    background: var(--pallete-background-primary-light);
    border-bottom: 1px solid var(--pallete-colors-border);
    padding: 15px 20px 16px 33px;

    @media (max-width: 767px) {
      padding: 15px 15px 16px 13px;
    }

    .user-name {
      color: var(--pallete-text-main);
    }
  }

  .list-course-detail {
    .link-item {
      background: var(--pallete-background-default);
      justify-content: space-between;
    }

    .img-arrow {
      color: #727272;
    }
  }
`;
