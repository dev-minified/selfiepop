import { AvatarName, ProfleTickIcon } from 'assets/svgs';
import StikcyDropDown from 'components/StickyDropDown';
import Tag from 'components/Tag';
import ToolTip from 'components/tooltip';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import AvatarStatus from 'pages/chat/components/AvatarStatus';
import { ReactElement, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
dayjs.extend(relativeTime);
dayjs.extend(utc);
interface Props {
  className?: string;
  onChatClick?: (user: IOrderUserType) => void;
  user: IOrderUserType;
}

function RoomCard({
  className,
  onChatClick,
  user: SubUser,
}: Props): ReactElement {
  // const subscriptionUser =
  //   user?._id === sub.sellerId._id ? sub.buyerId : sub.sellerId;
  const location = useLocation();
  const { userId } = parseQuery(location.search);
  const [tagIndex, setTagIndex] = useState(-1);
  let timestamp: any = '';

  if (SubUser?.lastMessageAt) {
    timestamp = SubUser?.lastMessageAt ? dayjs(SubUser?.lastMessageAt) : '';
  }
  if (timestamp) {
    timestamp = timestamp.utc().fromNow();
  }
  const mobile = useMediaQuery({ maxWidth: 767 });
  const tagss = (SubUser?.tags || []).slice(3) || [];
  const isUserVerified =
    SubUser?.buyerId?.isEmailVerified && SubUser?.buyerId?.idIsVerified;
  const totalEarning = parseFloat(SubUser?.totalEarnings + '');
  return (
    <div
      className={`${className} chat-user-area ${
        userId === SubUser?.buyerId?._id ? 'active' : ''
      }`}
      onClick={() => onChatClick?.(SubUser)}
    >
      <AvatarStatus
        imgSettings={{
          onlyMobile: true,
          imgix: {
            all: 'w=200&h=200',
          },
        }}
        src={SubUser?.buyerId?.profileImage}
        // src={
        //   SubUser?.buyerId?.profileImage ||
        //   '/assets/images/default-profile-img.svg'
        // }
        fallbackComponent={
          <AvatarName text={SubUser?.buyerId?.pageTitle || 'Incongnito User'} />
        }
        fallbackUrl={'/assets/images/default-profile-img.svg'}
        isActive={SubUser?.buyerId?.isOnline}
      />
      <div className="user-detail">
        <strong className="user-name">
          {`${SubUser?.buyerId?.pageTitle ?? 'Incognito User'}`}{' '}
          {isUserVerified ? (
            <ProfleTickIcon
              width="13"
              height="13"
              fill="var(--pallete-primary-main)"
            />
          ) : null}
        </strong>
        <div className="member-tags-area">
          <span className="member-total-amount">
            $
            {SubUser?.totalEarnings
              ? totalEarning >= 0
                ? totalEarning
                : 0
              : 0}
          </span>
          <div
            className={`member-tags-wrap ${
              (SubUser?.tags?.length as number) > 2 && 'show_count'
            }`}
          >
            {SubUser?.tags?.map((userTag, index) =>
              tagIndex !== index ? (
                <span
                  onMouseEnter={(e) => {
                    if (e.target) {
                      const width = (e.target as any).clientWidth;

                      if (width >= 70 || (mobile && width >= 40)) {
                        setTagIndex(() => index);
                      }
                    }
                  }}
                  className={`member-tag tag_${index}`}
                  key={`${userTag}-${index}`}
                >
                  {userTag}
                </span>
              ) : (
                <ToolTip overlay={userTag} key={`${userTag}-${index}`}>
                  <span className="member-tag" key={`${userTag}-${index}`}>
                    {userTag}
                  </span>
                </ToolTip>
              ),
            )}
            <StikcyDropDown
              className="dotsDrop"
              button={(props) => {
                return (
                  <>
                    {(SubUser?.tags?.length as number) > 3 && (
                      <span
                        className="counter"
                        onClick={(e) => {
                          e.stopPropagation();
                          props.handleToggle(e);
                        }}
                        ref={props.ref}
                      >
                        <span className="arrow"></span>
                        {/* +{' '} {(SubUser?.tags?.length as number) - 3} */}
                      </span>
                    )}
                  </>
                );
              }}
              items={tagss || []}
              renderItems={(props) => {
                const { items = [] } = props;
                return (
                  <div className="more-member-tags">
                    {items.map((item: any, idx: number) => {
                      return (
                        <div key={`${item}-${idx}`}>
                          <span className="member-tag" title={item}>
                            <Tag label={item} closeAble={item.removable} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="more-info">
        {!!timestamp && <div className="time-info">{timestamp}</div>}
        <div className="orders-detail-area">
          {!!SubUser?.unread && SubUser?.unread > 0 && (
            <span className="unread-messages">{SubUser?.unread}</span>
          )}
          {!!SubUser?.buyerId?.stripe?.customerId && (
            <span className="messages-sign">$</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default styled(RoomCard)`
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 1px;
  transition: all 0.4s ease;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;

  @media (max-width: 1199px) {
    padding: 15px;
  }

  &:hover {
    background: var(--pallete-background-secondary);
  }

  &.active {
    border-color: var(--pallete-primary-main);
  }

  .member-tags-area {
    display: flex;
    align-items: center;

    @media (max-width: 767px) {
      flex-wrap: wrap;
    }

    .member-total-amount {
      color: #a27fa6;
      font-size: 14px;
      line-height: 16px;
      font-weight: 500;
      margin: 0 5px 0 0;
      letter-spacing: 0.5;

      @media (max-width: 767px) {
        width: 100%;
      }
    }

    .counter {
      background: rgba(172, 180, 221, 0.32);
      display: inline-block;
      vertical-align: top;
      color: #fff;
      font-size: 12px;
      line-height: 14px;
      padding: 2px 7px;
      cursor: pointer;
      margin: 1px 5px 1px 0;
      border-radius: 18px;
      font-weight: 500;
      transition: all 0.4s ease;
      min-height: 18px;

      &:hover {
        background: var(--colors-indigo-500);

        .arrow {
          border-color: #fff transparent transparent transparent;
        }
      }
    }

    .arrow {
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: var(--pallete-text-secondary-150) transparent transparent
        transparent;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .member-tags-wrap {
    overflow: hidden;
    white-space: nowrap;

    .member-tag {
      text-overflow: ellipsis;
      max-width: 43px;
      @media (max-width: 767px) {
        max-width: 50px;
      }
      &:nth-child(2) {
        + .member-tag,
        ~ .member-tag {
          display: none !important;
        }
      }

      &:nth-child(2) {
        + .member-tag,
        ~ .member-tag {
          @media (max-width: 767px) {
            display: none !important;
          }
        }
      }
    }
  }

  .dotsDrop {
    display: inline-block;
    vertical-align: top;
  }

  .user-detail {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 0 5px 0 15px;
  }

  .more-info {
    text-align: right;
    color: #9d9e9f;
    font-size: 11px;
    line-height: 13px;
    font-weight: 500;
  }

  .orders-detail-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .time-info {
    margin: 3px 0 10px;
  }

  .order-info {
    background: #16c107;
    color: #fff;
    text-transform: uppercase;
    font-size: 12px;
    line-height: 15px;
    padding: 2px 7px 1px;
    border-radius: 3px;
    font-weight: 500;

    span {
      display: inline-block;
      vertical-align: top;
      padding: 0 0 0 2px;
    }
  }

  .unread-messages,
  .account-subscriptions {
    display: inline-block;
    vertical-align: top;
    background: var(--colors-indigo-500);
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    line-height: 16px;
    padding: 1px 7px;
    font-weight: 500;
    margin: 0 0 0 5px;
  }

  .account-subscriptions {
    background: #838385;
  }

  .number {
    min-width: 22px;
    height: 17px;
    background: var(--pallete-primary-main);
    color: #ffffff;
    border-radius: 3px;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    display: inline-block;
    vertical-align: top;
    text-align: center;
  }

  .user-name {
    color: var(--pallete-text-main-550);
    font-weight: 500;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;

    .sp_dark & {
      color: #fff;

      svg {
        path {
          fill: #fff;
        }
      }
    }
  }

  .description {
    color: var(--pallete-primary-main);
    font-size: 15px;
    line-height: 18px;
    font-weight: 400;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;

    .sp_dark & {
      color: #d0d0d0;
    }
  }

  .messages-sign {
    display: inline-block;
    vertical-align: top;
    background: var(--pallete-text-secondary-150);
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    line-height: 14px;
    padding: 3px 7px 1px;
    font-weight: 500;
    margin: 0 0 0 5px;
  }
`;
