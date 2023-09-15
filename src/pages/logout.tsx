import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';

const LogoutFC: React.FC = () => {
  const { Logout, isAuthenticated, loggedIn } = useAuth();
  // tslint:disable-next-line: react-hooks-nesting
  useEffect(() => {
    if (loggedIn && isAuthenticated) {
      Logout();
    }
  }, [Logout, loggedIn, isAuthenticated]);
  return <div>...logging out</div>;
};

export default LogoutFC;
