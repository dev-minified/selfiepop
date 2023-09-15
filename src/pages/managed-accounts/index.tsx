import UserList from 'components/UserList';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getManagedUsers } from 'store/reducer/managed-users';
import styled from 'styled-components';
import { setSessionStorage } from 'util/index';

type Props = {
  className?: string;
};

const ManagedAccounts: React.FC<Props> = (props) => {
  const { className } = props;

  const history = useHistory();
  const dispatch = useAppDispatch();
  const { withLoader } = useRequestLoader();

  const [items, setItems] = useState<any[]>([]);

  const managedUsers = useAppSelector((state) => state.managedUsers.list);

  useEffect(() => {
    setSessionStorage('my-profile', false, false);

    withLoader(dispatch(getManagedUsers()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!managedUsers?.length) {
      setItems(
        managedUsers
          .filter((u) => !!u?._id)
          .map((user) => ({
            id: user._id,
            image: user.profileImage,
            title: `${user.pageTitle ?? 'Incognito User'}`,
            isOnline: user.isOnline,
            extra: (
              <div>
                {user.subscription != null ? (
                  <span className="account-subscriptions">
                    {user.subscription}
                  </span>
                ) : null}
                {user?.unread != null ? (
                  <span className="unread-messages">{user?.unread}</span>
                ) : null}
              </div>
            ),
          })),
      );
    }
  }, [managedUsers]);

  return (
    <div className={`${className} user-management-block`}>
      <UserList
        items={items}
        onItemClick={(item) => {
          history.push(`/managed-accounts/${item.id}`);
        }}
        allowSearch={false}
      />
    </div>
  );
};

export default styled(ManagedAccounts)`
  height: 100%;
`;
