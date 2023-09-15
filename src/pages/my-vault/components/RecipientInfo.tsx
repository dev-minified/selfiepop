import {
  AvatarName,
  ProfleTickIcon,
  SalespurchasesChat,
  Star,
} from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppSelector } from 'hooks/useAppSelector';

import { ReactElement } from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
const UserDetailedAvatar = styled(AvatarStatus)`
  &.user-image {
    width: 100%;
    height: 100%;
  }
`;
interface Props {
  className?: string;
  user?: ChatSubsType | null;
}

function RecipientInfo({ className }: Props): ReactElement {
  const selectedOrder = useAppSelector((state) => state.vault.selectedUser);
  const { userId, subId } = parseQuery(location.search);

  const history = useHistory();

  const seller: any = selectedOrder?.sellerId;
  const isUserVerified = seller?.isEmailVerified && seller?.idIsVerified;
  return (
    <div className={className}>
      <div className="recipient_avatar">
        <UserDetailedAvatar
          src={seller?.profileImage}
          imgSettings={{ onlyDesktop: true }}
          fallbackComponent={
            <AvatarName text={seller?.pageTitle ?? 'Incognito User'} />
          }
        />
      </div>
      <h4 className="name_title">
        {`${seller?.pageTitle ?? 'Incognito User'}`}

        {isUserVerified ? (
          <ProfleTickIcon
            width="15"
            height="15"
            fill="var(--pallete-primary-main)"
          />
        ) : null}
      </h4>
      <span
        className={`username`}
        onClick={(e) => {
          e.stopPropagation();
          window.open(`/profile/${seller?.username}`);
        }}
      >
        @{seller?.username}
      </span>

      <ul className="list-btns d-flex flex-column">
        {seller?._id && (
          <li>
            <Button className="last_seen" shape="circle">
              {seller?.isOnline
                ? 'Online'
                : `Last seen ${dayjs(seller?.offlineAt).utc().fromNow()}`}
            </Button>
          </li>
        )}
        <li>
          <Button
            type="default"
            className="btn"
            icon={
              <Star
                width={20}
                height={20}
                secondaryColor="transparent"
                primaryColor="var(--pallete-primary-main)"
              />
            }
            onClick={() => {
              window.open(`/profile/${seller?.username}`);
            }}
          >
            View Profile
          </Button>
        </li>
        <li>
          <Button
            type="default"
            className="btn-notifications btn"
            icon={<SalespurchasesChat />}
            onClick={(e) => {
              e.stopPropagation();
              history.push(
                `messages/subscriptions?userId=${userId}&subId=${subId}`,
              );
            }}
          >
            Send Message
          </Button>
        </li>
      </ul>
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

  .gift-box {
    padding: 0;
    .roses_section {
      @media (min-width: 1200px) {
        padding: 0 5px;
      }
    }
    .btn-price {
      font-size: 14px;
    }
  }
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
    display: block;
    color: var(--pallete-text-light-200);
    margin: 0 0 9px;
    cursor: pointer;
  }
  .description {
    color: #131549;
    margin: 0 0 10px;
  }
  .last_seen {
    padding: 2px 5px;
    color: var(--pallete-primary-main);
    font-size: 14px;
    line-height: 17px;
    margin: 0 0 10px;
    pointer-events: none;
  }
  .list-btns {
    padding: 11px 0 3px;
    margin: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;

    + .list-btns {
      padding-top: 16px;
    }

    li {
      padding: 0 10px;
      width: 100%;

      + li {
        margin: 10px 0 0;
      }
    }

    .button {
      color: var(--pallete-text-button-primary);
      background-color: var(--pallete-background-light);
      width: 100%;
      max-width: 204px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      font-size: 14px;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }

      svg {
        color: #fff;
      }

      .flame-icon {
        circle {
          fill: transparent;
        }
      }

      .text-button {
        flex-grow: 1;
        flex-basis: 0;
        min-width: 0;
        text-align: center;
      }

      &:hover {
        color: #fff;

        .sp_dark & {
          background: var(--colors-indigo-200);
        }
      }
    }
  }

  .btn-renewel {
    border: none !important;
    font-size: 12px;
    line-height: 14px;

    &.button-sm {
      font-size: 12px;
      line-height: 14px;
    }

    &:hover {
      background: none;
    }

    &:not(:hover) {
      color: rgba(255, 255, 255, 0.4);

      .text-offwhite {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
`;
