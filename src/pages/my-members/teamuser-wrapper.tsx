import { deleteTeamManagedUsers } from 'api/team-manager';
import {
  CrossStatusIcon,
  DeclinedStatus,
  PendingStatus,
  SalespurchasesChat,
  StarSquare,
  TickIcon,
  UnlockIcon,
} from 'assets/svgs';
import classNames from 'classnames';
import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getTeamManagedUsers,
  resetTeamManagedUser,
  setTeamManagedUser,
} from 'store/reducer/teamManager';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import TeamMembers from './components/TeamModule';
// '/my-members/add-team-member';
const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'pending':
      return <PendingStatus />;
    case 'declined':
      return <DeclinedStatus />;
    case 'canceled':
      return <CrossStatusIcon />;
    case 'active':
      return <TickIcon />;
    default:
      return null;
  }
};

const TeamUserWrapper = ({ className }: { className?: string }) => {
  const history = useHistory();
  const [items, setItems] = useState<any[]>([]);
  const [isActiveOrPending, setIsActiveOrPending] = useState<number>(0);
  const managedAccounts = useAppSelector(
    (state) => state.teamManagedUsers.list,
  );
  const analytics = useAnalytics();
  const { user, setUser } = useAuth();
  const dispatch = useAppDispatch();
  const { withLoader } = useRequestLoader();
  useEffect(() => {
    dispatch(resetTeamManagedUser());
    withLoader(
      dispatch(getTeamManagedUsers())
        .unwrap()
        .then((data) => {
          let counter = 0;
          setItems(
            data?.map((user: TeamMember, index: number) => {
              if (user?.status === 'pending' || user?.status === 'active') {
                counter = counter + 1;
              }
              return {
                item: user,
                id: user?._id,
                idx: index,
                userId: user?.userId?._id,
                image: user.userId?.profileImage,
                title: `${user.userId?.pageTitle ?? 'Incognito User'}`,
                isOnline: user?.userId?.isOnline,
                description: user?.userId?.username
                  ? `@${user?.userId?.username}`
                  : '',
                extra: statusHtml(user?.status),
                status: user?.status,
              };
            }),
          );
          setIsActiveOrPending(counter);
        })
        .catch((e) => console.log(e)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const statusHtml = (status?: string) => {
    return (
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
        <span className={classNames('user-status', status)}>
          {status} {getStatusIcon(status)}
        </span>
      </div>
    );
  };
  return (
    <div className={className}>
      <Scrollbar>
        <TeamMembers
          items={items}
          activeOrpendingLength={isActiveOrPending}
          buttonText="ADD NEW TEAM MEMBER"
          buttonUrl="/my-members/add-team-member"
          caption={
            <div>
              <p>
                Click the <strong>ADD TEAM MEMBER</strong> button below to allow
                other users to share access to your member management tools
                and/or to split your comissions.
              </p>
            </div>
          }
          onChangeHistory={(item) => {
            dispatch(setTeamManagedUser(managedAccounts[item?.idx]));
            setTimeout(() => {
              history.push(
                `/my-members/add-team-member/${item?.id}/settings/edit`,
              );
            }, 500);
          }}
          onDelete={(item: any) => {
            // eslint-disable-next-line
            const { createdAt, _id, userId, ...rest } = item.item;
            deleteTeamManagedUsers(item?.userId, rest).then(() => {
              analytics.track('remove_manager', {
                managerRemove: item?.userId,
              });
              const updatedItems = [...items];
              let canceledItem = updatedItems[item.idx];
              canceledItem = {
                ...canceledItem,
                extra: statusHtml('cancelled'),
                status: 'cancelled',
              };
              updatedItems[item?.idx] = canceledItem;
              setItems(updatedItems);
              setIsActiveOrPending(isActiveOrPending - 1);
              const managerlist = [...(user?.managerList || [])];
              const managerIndex = managerlist?.findIndex((itm: any) => {
                return itm?._id === item?.id;
              });
              if (managerIndex !== -1) {
                managerlist[managerIndex] = {
                  ...managerlist[managerIndex],
                  status: 'cancelled',
                };
                setUser({ ...user, managerList: managerlist });
              }
            });
          }}
        />
      </Scrollbar>
    </div>
  );
};

export default styled(TeamUserWrapper)`
  height: 100%;
`;
