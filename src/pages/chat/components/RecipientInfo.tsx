import { addNickNameAndNotifications } from 'api/ChatSubscriptions';
import { getMemberShipsByUserId } from 'api/sales';
import {
  Announcement,
  AvatarName,
  Bell,
  Heat,
  ProfleTickIcon,
  StarFill,
} from 'assets/svgs';
import Button from 'components/NButton';
import ToolTip from 'components/tooltip';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import { updateNoticationsAndNickName } from 'store/reducer/chat';
import styled from 'styled-components';
import AvatarStatus from './AvatarStatus';
import { FavoritesModel, NotificationModel, UserShoutModel } from './Models';
dayjs.extend(utc);
dayjs.extend(relativeTime);
enum ModelEnums {
  notificationsModel = 'notificationsModel',
  userShoutModel = 'userShoutModel',
  favoritesModel = 'favoritesModel',
}
const UserDetailedAvatar = styled(AvatarStatus)`
  &.user-image {
    width: 100%;
    height: 100%;
  }
`;
interface Props {
  className?: string;
  sub: ChatSubsType;
  isBuyer?: boolean;
  user?: ChatUserType;
  managedAccountId?: string;
  onClick?: (...args: any[]) => void;
}

function RecipientInfo({
  className,
  sub,
  isBuyer,
  user,
  managedAccountId,
  onClick,
}: Props): ReactElement {
  const { user: User } = useAuth();
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVariation, setSelectedVariation] = useState('');
  const dispatch = useAppDispatch();

  const handleNickNameAndNotifications = async (data: Record<string, any>) => {
    setSelectedModel('');
    await addNickNameAndNotifications(sub._id, {
      ...data,
      sellerId: managedAccountId,
    })
      .then(() => {
        dispatch(updateNoticationsAndNickName({ ...sub, ...data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setSelectedVariation('');
    const getDetail = async () => {
      if (sub?._id) {
        await getMemberShipsByUserId(
          User?._id as string,
          { sellerId: managedAccountId },
          {
            statusCodes: [404],
          },
        )
          .then((data) => {
            const selectedVar = data?.meberships?.find(
              (member: any) => member?._id === sub?.priceVariation?._id,
            );
            if (selectedVar) {
              setSelectedVariation(selectedVar?.title);
            } else {
              setSelectedVariation(sub?.priceVariation?._id as string);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub?._id, managedAccountId]);
  if (!sub?._id && !user?._id) return <></>;
  let isUserVerified = false;
  if (isBuyer) {
    isUserVerified = !!(
      sub?.sellerId?.isEmailVerified && sub?.sellerId?.idIsVerified
    );
  }
  if (!isBuyer) {
    isUserVerified = !!(
      sub?.buyerId?.isEmailVerified && sub?.buyerId?.idIsVerified
    );
  }
  return (
    <div className={className}>
      <div className="recipient_avatar">
        <UserDetailedAvatar
          src={user?.profileImage}
          imgSettings={{ onlyDesktop: true }}
          fallbackComponent={
            <AvatarName text={user?.pageTitle ?? 'Incognito User'} />
          }
        />
      </div>
      <h4 className="name_title">
        {!!sub?.nickName
          ? sub?.nickName
          : `${user?.pageTitle ?? 'Incognito User'}`}
        {isUserVerified ? (
          <ProfleTickIcon
            width="13"
            height="13"
            fill="var(--pallete-primary-main)"
          />
        ) : null}
      </h4>
      <span onClick={onClick} className="username">
        @{user?.username}
      </span>
      <div className="description">{user?.tagline}</div>
      {!!selectedVariation && (
        <span className="selected-variant">
          <Heat /> {selectedVariation}
        </span>
      )}

      <Button className="last_seen" shape="circle">
        {user?.isOnline
          ? 'Online'
          : `Last seen ${dayjs(user?.offlineAt).utc().fromNow()}`}
      </Button>
      {!isBuyer && sub?.isActive && (
        <ul className="list-btns">
          <li>
            <ToolTip overlay={'Add Subscription to List'}>
              <Button
                icon={<StarFill />}
                onClick={() => setSelectedModel(ModelEnums.favoritesModel)}
              />
            </ToolTip>
          </li>
          <li>
            <ToolTip overlay={'Manage User Notifications'}>
              <Button
                icon={<Bell />}
                onClick={() => setSelectedModel(ModelEnums.notificationsModel)}
              />
            </ToolTip>
          </li>
          <li>
            <ToolTip overlay={'Manage User Nick name'}>
              <Button
                icon={<Announcement />}
                onClick={() => setSelectedModel(ModelEnums.userShoutModel)}
              />
            </ToolTip>
          </li>
        </ul>
      )}
      <UserShoutModel
        onSave={(name) => {
          handleNickNameAndNotifications({
            notifications: !!sub?.notifications,
            nickName: name,
          });
        }}
        value={sub?.nickName}
        user={user}
        isOpen={selectedModel === ModelEnums.userShoutModel}
        onCancel={() => setSelectedModel('')}
      />
      <NotificationModel
        onSave={(checked) => {
          handleNickNameAndNotifications({
            nickName: sub?.nickName,
            notifications: checked,
          });
        }}
        value={sub?.notifications}
        user={user}
        isOpen={selectedModel === ModelEnums.notificationsModel}
        onCancel={() => setSelectedModel('')}
      />
      <FavoritesModel
        sub={sub}
        isOpen={selectedModel === ModelEnums.favoritesModel}
        onClose={() => setSelectedModel('')}
        managedAccountId={managedAccountId}
      />
    </div>
  );
}

export default styled(RecipientInfo)`
  padding: 20px;
  background: var(--pallete-background-default);
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  border: 2px solid var(--pallete-colors-border);

  .recipient_avatar {
    width: 132px;
    height: 132px;
    border-radius: 100%;
    margin: 0 auto 8px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h4 {
    color: var(--pallete-text-light-100);
    margin: 0 0 5px;

    svg {
      margin: 0 0 0 10px;
      display: inline-block;
      vertical-align: middle;

      path {
        .sp_dark & {
          fill: var(--pallete-text-main);
        }
      }
    }
  }

  .username {
    cursor: pointer;
    display: block;
    color: var(--pallete-text-light-200);
    margin: 0 0 9px;
  }

  .description {
    color: #131549;
    margin: 0 0 10px;
  }

  .last_seen {
    padding: 2px 5px;
    /* color: var(--pallete-primary-main); */
    background: var(--pallete-background-light);
    color: var(--pallete-text-button-primary);
    font-size: 14px;
    line-height: 17px;
    margin: 0 0 10px;
    pointer-events: none;
  }

  .selected-variant {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 16px;
    color: var(--pallete-text-secondary);
    font-weight: 500;
    margin: 0 0 15px;

    svg {
      margin: 0 10px 0 0;
    }
  }

  .list-btns {
    padding: 11px 0 3px;
    margin: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;

    li {
      padding: 0 10px;
    }

    .button {
      background: var(--pallete-text-secondary-200);
      color: #fff;
      border-color: var(--pallete-text-secondary-200);
    }
  }
`;
