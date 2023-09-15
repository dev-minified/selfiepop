import { getStatusIcon } from 'appconstants';
import { SalespurchasesChat, StarSquare, UnlockIcon } from 'assets/svgs';
import classNames from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ManagerItemStatus } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useRequestLoader from 'hooks/useRequestLoader';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getManagedAccountsOffers,
  resetManagedAccounts,
  setManagedAccounts,
} from 'store/reducer/managedAccounts';
import styled from 'styled-components';
import { setSessionStorage } from 'util/index';
import TeamMembers from './components/TeamModule';
dayjs.extend(utc);
let intervalId: NodeJS.Timeout;
const ManagedUserWrapper = () => {
  const history = useHistory();
  // const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const { withLoader } = useRequestLoader();
  const [items, setItems] = useState<any[]>([]);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  // eslint-disable-next-line
  const [activeNonActive, setAactiveNonActive] = useState<any>({
    activeItems: [],
    nonActiveItems: [],
  });
  // eslint-disable-next-line
  const [originalItems, setOriginalItems] = useState<any[]>([]);
  // const { user } = useAuth();
  const getDateandClass = (item: any) => {
    let bgCls = '';
    let date = '';
    if (
      item?.sortUnread &&
      item?.status === ManagerItemStatus?.active &&
      !!item?.sortUnread?.unread
    ) {
      // const oldunReadtime = dayjs().diff(
      //   dayjs(item?.sortUnread?.oldUnread),
      //   'minutes',
      // );
      const oldunReadtime = dayjs().diff(
        dayjs(item?.sortUnread?.oldUnread),
        'hours',
      );
      date = dayjs(item?.sortUnread?.oldUnread).format('DD/MM/YYYY h:mm A');
      // bgCls =
      //   oldunReadtime >= 4 ? 'red-Bg' : oldunReadtime >= 2 ? 'yellow-Bg' : '';
      bgCls =
        oldunReadtime >= 2 ? 'red-Bg' : oldunReadtime >= 1 ? 'yellow-Bg' : '';
    }
    return { bgClass: bgCls, unreadDate: date };
  };
  const onCreateItems = (items: any[]) => {
    return items?.map((user: any) => {
      return {
        id: user?._id,
        userId: user?.userId?._id,
        image: user.userId?.profileImage,
        title: `${user.userId?.pageTitle ?? 'Incognito User'}`,
        isOnline: user.isOnline,
        status: user.status,
        description: user?.userId?.username ? `@${user?.userId?.username}` : '',
        request: (
          <span className={classNames('user-status', user?.status)}>
            {`${user?.status === 'pending' ? 'Request' : ''} ${user?.status}`}
            {getStatusIcon(user?.status)}
          </span>
        ),
        oldUnread: user?.bgClass,
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
            <span className={classNames('user-status', user?.status)}>
              <>
                {user?.status} {getStatusIcon(user?.status)}
                <span className="date">{user?.unreadDate}</span>
                {user?.status === ManagerItemStatus.active &&
                  !!user?.sortUnread?.unread && (
                    <span className="counter">
                      {user?.sortUnread?.unread || 0}
                    </span>
                  )}
              </>
            </span>
          </div>
        ),
      };
    });
  };
  const sortArrayElements = (items: any[] = []) => {
    const newSortList = [...items].sort((a, b) => {
      if (!a?.sortUnread) return 1;
      if (!b?.sortUnread) return -1;
      if (!a?.sortUnread?.oldUnread) return 1;
      if (!b?.sortUnread?.oldUnread) return -1;

      const date1 = a?.sortUnread?.oldUnread;
      const date2 = b?.sortUnread?.oldUnread;
      if (date1 < date2) {
        return -1;
      }
      if (date1 > date2) {
        return 1;
      }
      return 0;
    });
    return newSortList;
  };
  const sortArray = (items: any[]) => {
    const activeItems: any[] = [];
    const notActiveItems: any[] = [];
    [...items].forEach((ac) => {
      // if (!ac?.sortUnread || ac.status !== ManagerItemStatus?.active) {
      if (ac.status !== ManagerItemStatus?.active) {
        notActiveItems.push(ac);
        return;
      }
      const { bgClass, unreadDate } = getDateandClass(ac);
      return activeItems.push({ ...ac, bgClass, unreadDate });
    });

    const newSortList = sortArrayElements(activeItems);

    setAactiveNonActive((_: any) => ({
      ..._,
      activeItems: newSortList,
      nonActiveItems: onCreateItems(notActiveItems),
    }));

    return newSortList.concat(notActiveItems);
  };
  const sortAfterInterval = (items: any[]) => {
    const activeItems: any[] = [];
    [...items].forEach((ac) => {
      const { bgClass, unreadDate } = getDateandClass(ac);
      return activeItems.push({ ...ac, bgClass, unreadDate });
    });
    const sortedElements = sortArrayElements(activeItems);

    return sortedElements;
  };

  const sortActiveArray = (items: any[]) => {
    const sortedElements = sortAfterInterval(items || []);
    setAactiveNonActive((_: any) => ({ ..._, activeItems: sortedElements }));
    return sortedElements;
  };
  useEffect(() => {
    setSessionStorage('my-profile', true, false);
    dispatch(resetManagedAccounts());
    withLoader(dispatch(getManagedAccountsOffers()).unwrap())
      .then((acc) => {
        const sortedArray = sortArray(acc || []);
        setOriginalItems(sortedArray);
        // onCreateItems(sortedArray);
        setItems(onCreateItems(sortedArray));
        return true;
      })
      .catch(() => console.log);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    clearInterval(intervalId);

    console.log('set interval');
    intervalId = setInterval(() => {
      console.log('interval runs');
      setAactiveNonActive((_: any) => {
        const sortedElemnts = sortAfterInterval(_?.activeItems || []);

        setItems(() =>
          [...onCreateItems(sortedElemnts)].concat(_?.nonActiveItems),
        );
        return { ..._, activeItems: sortedElemnts };
      });
    }, 300000);
    // }, 10000);

    return () => {
      console.log('clearing interval');
      clearInterval(intervalId);
    };
  }, [isSorted]);

  const onChangeUnread = useCallback(
    (data: any, userId: string) => {
      setAactiveNonActive((items: any) => {
        console.log({ data });
        let updatedItems = [...items?.activeItems];
        const index = updatedItems.findIndex(
          (a) =>
            a?.userId?._id === userId && a.status === ManagerItemStatus?.active,
        );
        let sort = false;
        if (index !== -1) {
          let itemToupdate = { ...updatedItems?.[index] };
          const sortUnread = { ...itemToupdate?.sortUnread };
          if (data.type === 'chat') {
            if (itemToupdate?.sortUnread) {
              if (sortUnread?.unread === 0) {
                sortUnread.oldUnread = dayjs().utc().format();
                sort = true;
              }

              const { bgClass, unreadDate } = getDateandClass({
                ...itemToupdate,
              });
              sortUnread.unread = (sortUnread?.unread || 0) + 1;

              itemToupdate = {
                ...itemToupdate,
                sortUnread: sortUnread,
                bgClass,
                unreadDate,
              };
            } else {
              itemToupdate = {
                ...itemToupdate,
                sortUnread: {
                  oldUnread: dayjs().utc().format(),
                  unread: 1,
                  _id: '',
                },
              };
              sort = true;
            }
          }

          if (data.type === 'messageView') {
            const unreadcount = data?.unread || 0;
            const sortUnreadCount = sortUnread?.unread || 0;
            sortUnread.unread = unreadcount;

            itemToupdate = {
              ...itemToupdate,
              sortUnread: {
                ...sortUnread,
                oldUnread: !!unreadcount ? sortUnread?.oldUnread : null,
              },
            };

            if (unreadcount === 0 && sortUnreadCount !== 0) {
              sort = true;
            }
          }
          updatedItems[index] = itemToupdate;
        }
        if (sort) {
          updatedItems = sortActiveArray(updatedItems || []);
          setIsSorted((isSorted) => !isSorted);
          sort = false;
        }
        setItems(() => [
          ...onCreateItems(updatedItems),
          ...items?.nonActiveItems,
        ]);
        return { ...items, activeItems: updatedItems };
      });
    },

    [],
  );

  return (
    <TeamMembers
      items={items}
      isMember={false}
      isDelete={false}
      onChangeUnread={onChangeUnread}
      buttonUrl="/my-members/add-team-member"
      onChangeHistory={(item: any) => {
        if (item.status === 'active') {
          history.push(`/managed-accounts/${item.userId}`);
        } else {
          dispatch(setManagedAccounts(item));
          history.push(`/my-profile/managed-accounts/${item.id}`);
        }
      }}
    />
  );
};

export default styled(ManagedUserWrapper)``;
