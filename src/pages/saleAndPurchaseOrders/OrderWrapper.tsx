import useAuth from 'hooks/useAuth';
import { ReactNode, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
export const ordersRouter: string[] = [
  '/orders',
  '/orders/my-sales',
  '/orders/my-purchases',
];

export const Orderwrapper = ({ children }: { children: ReactNode }) => {
  const history = useHistory();
  const location = useLocation();
  const { showSellerMenu, idIsVerified, isEmailVerified } = useAuth()?.user;

  useEffect(() => {
    const allowSellMenu = showSellerMenu && idIsVerified && isEmailVerified;
    const isOrders = location.pathname === ordersRouter[0];
    if (allowSellMenu) {
      if (isOrders) {
        history.push(ordersRouter[1]);
      }
    } else if (isOrders) {
      history.push(ordersRouter[2]);
    }
  }, [location.pathname]);
  return <>{children}</>;
};
