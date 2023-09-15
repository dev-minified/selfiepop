import classNames from 'classnames';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { setOrder } from 'store/reducer/checkout';
import styled from 'styled-components';
import { getOrder } from '../api/Order';
import { parseQuery } from '../util';
// import PublicUserLayout from './publicUser';

const Purchase: React.FC<{ className?: string; children?: ReactNode }> = (
  props,
) => {
  const { children, className } = props;
  const dispatch = useAppDispatch();
  const { withLoader } = useRequestLoader();
  const [fetchingorder, setFetching] = useState(false);
  const userId = useAuth()?.user?._id;
  const loggedIn = useAuth()?.loggedIn;
  const guestUser = useAppSelector((state) => state.checkout.guestUser?.data);
  const checkoutOrder = useAppSelector((state) => state.checkout.order);
  const history = useHistory();
  const { username } = useParams<any>();
  const location = useLocation();
  const { order } = parseQuery(location.search);
  const getOrderDetails = useCallback(
    async (orderId: string) => {
      if (!!order && !userId && !guestUser?._id) {
        return history.replace(`/${username}`);
      }
      setFetching(true);
      const fetcedOrder = await getOrder(orderId).catch(console.log);
      setFetching(false);
      if (userId && userId !== fetcedOrder?.buyer?._id) {
        return history.replace(`/${username}`);
      } else if (
        guestUser?._id &&
        !!order &&
        fetcedOrder?.buyer?._id !== guestUser?._id
      ) {
        return history.replace(`/${username}`);
      }

      if (fetcedOrder) {
        dispatch(setOrder(fetcedOrder));
      }
    },
    [dispatch, userId, guestUser?._id],
  );

  useEffect(() => {
    if (!!order && order !== checkoutOrder?._id) {
      getOrderDetails(order as string).finally(() => {
        setFetching(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, userId, loggedIn, guestUser?._id]);

  return (
    <div className={classNames('purchase__layout', className)}>
      {/* <GetTitle /> */}
      {fetchingorder ? <RequestLoader isLoading /> : children}
    </div>
  );
};

export default styled(Purchase)`
  h2 {
    text-align: center;
    margin: -10px 0 57px;
    font-size: 26px;

    @media (max-width: 767px) {
      margin: -10px 0 30px;
    }
  }

  .agewidget {
    margin: 0 0 40px;

    .checkbox label {
      padding: 0;
    }
  }

  .terms-area {
    padding: 30px 0 0;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;

    p {
      margin: 0;
    }

    strong {
      font-weight: 500;
    }
  }
`;
