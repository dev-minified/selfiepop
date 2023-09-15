import { fetchUserByName } from 'api/User';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface Props {
  children?: ReactNode;
  [key: string]: any;
}

const InnerInviteLayout: React.FC<Props> = ({ children, ...props }) => {
  const [user, setUser] = useState();
  const history = useHistory();
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    if (username) {
      fetchUserByName(username)
        .then((res) => {
          if (!res?.isAffiliate) {
            return history.push('/my-profile');
          }
          setUser(res);
        })
        .catch(() => {
          return history.push('/my-profile');
        });
    }
  }, [username]);

  return React.cloneElement(children as ReactElement, { ...props, user });
};

export default InnerInviteLayout;
