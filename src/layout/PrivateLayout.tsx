import { stringify } from 'querystring';
import { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateLayout: React.FC = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();

  if (!user?._id) {
    const redirect = { redirect: window?.location?.href };

    return (
      <Redirect
        to={{
          pathname: '/login',
          search: stringify(redirect),
        }}
      />
    );
  }

  // authorised so return component
  return <>{children}</>;
};

export default PrivateLayout;
