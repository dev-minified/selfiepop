import { getStatusIcon } from 'appconstants';
import { SalespurchasesChat, StarSquare, UnlockIcon } from 'assets/svgs';
import classNames from 'classnames';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getManagedAccountById } from 'store/reducer/managed-users';

interface ImanagedAccount {
  id?: string;
  image?: string;
  title?: string;
  isOnline?: boolean;
  status?: string;
  description?: string;
  request?: ReactElement;
  extra?: ReactElement;
  commissionValue?: number;
  allowMessage?: boolean;
  allowContent?: boolean;
  allowOrders?: boolean;
  allowCommissions?: boolean;
}
function useManagedAccountsOffers() {
  const { id: accountId } = useParams<{ id: string }>();
  const [managedUser, setManagedUser] = useState<ImanagedAccount>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.managedUsers?.item);

  useEffect(() => {
    if (!managedUser.id) {
      setIsLoading(true);
      dispatch(
        getManagedAccountById({
          userId: accountId,
          params: {
            ignoreStatusCodes: [404],
          },
        }),
      )
        .unwrap()
        .then((res: any) => {
          setIsLoading(false);

          const account = res?.account;
          setManagedUser({
            id: account?.userId?._id,
            image: account?.userId?.profileImage,
            title: `${account?.userId?.pageTitle ?? 'Incognito User'}`,
            isOnline: account?.isOnline,
            status: account.status,
            description: account?.userId?.username
              ? `@${account?.userId?.username}`
              : '',
            request: (
              <span className={classNames('user-status', account?.status)}>
                {account?.status === 'pending' && 'Request'} {account?.status}{' '}
                {getStatusIcon(account?.status)}
              </span>
            ),

            extra: (
              <div className="more-info-area">
                <ul className="list-icons">
                  <li>
                    <StarSquare />
                  </li>
                  <li>
                    <SalespurchasesChat />
                  </li>
                  <li>
                    <UnlockIcon />
                  </li>
                </ul>
                <span className={classNames('user-status', account?.status)}>
                  {account?.status} {getStatusIcon(account?.status)}
                </span>
              </div>
            ),
            commissionValue: account?.commissionValue,
            allowMessage: account?.allowMessage,
            allowContent: account?.allowContent,
            allowOrders: account?.allowOrders,
            allowCommissions: account?.allowCommissions,
          });
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, item]);
  return { managedUser, item, isLoading };
}

export default useManagedAccountsOffers;
