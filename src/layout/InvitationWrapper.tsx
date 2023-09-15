import { getUserByHash } from 'api/invitation';
import useAuth from 'hooks/useAuth';
import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { parseQuery } from 'util/index';

const InvitationWrapper: React.FC = ({ children, ...props }: any) => {
  const { hash } = parseQuery(useLocation().search);
  const { loggedIn } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState<IUser & { _id: string }>();

  useEffect(() => {
    if (!hash || loggedIn) {
      history.push('/login');
      return;
    }

    getUserByHash(hash)
      .then((user) => {
        if (user?._id) {
          setUser(user);
        } else {
          history.push('/login');
        }
      })
      .catch(console.log);
  }, []);

  return user ? (
    <div>
      {React.cloneElement(children as ReactElement, { ...props, user })}
    </div>
  ) : null;
};

export default InvitationWrapper;
