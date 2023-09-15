import {
  AvatarName,
  Calendar,
  MessageUnlockIcon,
  PlayIcon,
  PostUnlockIcon,
  TipUnlockIcon,
} from 'assets/svgs';
import accept from 'attr-accept';
import classNames from 'classnames';
import ImageComp from 'components/Image';
import ImageModifications from 'components/ImageModifications';
import dayjs from 'dayjs';
import { ServiceType } from 'enums';
import React from 'react';
import styled from 'styled-components';

interface ISimpleView<T> {
  key: string;
  className?: string;
  data: T[];
  onRowClick?: (row?: T, key?: T[keyof T] | number) => void;
  options?: { [key: string]: boolean };
}

const SimpleView: React.FC<ISimpleView<any>> = (props) => {
  const { className, data, onRowClick } = props;

  const PostMessage = (props: any) => {
    const mediaLengh = props?.messageMedia?.length;
    return mediaLengh ? (
      <div className="users-list">
        {props?.messageMedia?.slice(0, 4)?.map((md: any, index: number) => {
          const isImage = accept(
            {
              type: md.type,
            },
            'image/*',
          );
          const showCounter = mediaLengh > 5 && index >= 3;
          return (
            <div className="user-image" key={md?._id}>
              {isImage ? (
                <ImageModifications
                  imgeSizesProps={{
                    onlyMobile: true,
                    imgix: {
                      all: 'w=480&h=220',
                    },
                  }}
                  src={md.path}
                  fallbackUrl={'/assets/images/default-profile-img.svg'}
                  alt="img description"
                />
              ) : (
                <div className="video_thumbnail">
                  <div className="icon-play">
                    <PlayIcon />
                  </div>

                  <ImageComp
                    className="img-responsive"
                    src={md.thumbnail}
                    alt={md.thumbnail}
                    fallbackUrl={md.thumbnail}
                  />
                </div>
              )}

              {showCounter ? (
                <span className="user-counter">+{mediaLengh - index}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    ) : null;
  };
  const getRow = (row: any, index: number) => {
    const {
      image,
      title,

      status,
      date,
      duedate,
      messageId,
      tipId,
      postId,
      popLiveDateTime,
      popType,
      user,
      ...rest
    } = row;
    let Image = (
      <ImageModifications
        imgeSizesProps={{
          onlyMobile: true,
          defaultUrl: image,
          imgix: {
            all: 'w=480&h=220',
          },
        }}
        // src={image || '/assets/images/default-profile-img.svg'}
        src={image}
        fallbackComponent={
          <AvatarName text={user?.pageTitle || 'Incognito User'} />
        }
        // fallbackUrl={'/assets/images/default-profile-img.svg'}
        alt="img description"
      />
    );
    let orderTitle = title;
    let MiddleArea: any = null;
    if (messageId) {
      const { messageMedia = [] } = messageId;
      Image = <MessageUnlockIcon />;
      orderTitle = 'Message Unlock';
      MiddleArea = <PostMessage messageMedia={messageMedia} />;
    }
    if (tipId) {
      Image = <TipUnlockIcon />;
      orderTitle = 'Tip';
    } else if (postId) {
      Image = <PostUnlockIcon />;
      orderTitle = 'Post Unlock';
      const { media = [] } = postId;
      MiddleArea = <PostMessage messageMedia={media} />;
    }
    let dueDate = duedate;
    if (popType === ServiceType.POPLIVE) {
      dueDate = dayjs(popLiveDateTime).format('ll hh:mm A');
    }
    return (
      <div
        className="primary-shadow order-widget"
        style={{ display: 'block' }}
        key={index}
        onClick={() => onRowClick?.(row)}
      >
        <div className="order-widget-wrap">
          <div className="img-holder">{Image}</div>
          <div className="wrap">
            <div className="title-area">
              <strong className="title">{orderTitle}</strong>
              {date && (
                <span className="date">
                  <span className="img-calendar">
                    <Calendar />
                  </span>
                  <time dateTime={date}>{date}</time>
                </span>
              )}
            </div>
            <div className="widget-right-area">
              {MiddleArea}
              <div className="widget-right-box">
                <span
                  className={` status ${status.toLowerCase()} text-capitalize`}
                >
                  {status}
                  <span className="status-img success">
                    {/* {getOrderStatusIcon(status.toLowerCase())} */}
                  </span>
                </span>
                {dueDate && (
                  <span className="date">
                    Scheduled:
                    <time className="date-schedule" dateTime={date}>
                      {dueDate}
                    </time>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div id="list-area" className={classNames(className, 'mb-30')}>
      {data?.map((row: any, index: number) => {
        return getRow(row, index);
      })}
    </div>
  );
};

export default styled(SimpleView)`
  .order-widget-wrap {
    padding: 10px;
    font-weight: 400;
    line-height: 1.2;
    position: relative;

    @media (max-width: 500px) {
      align-items: flex-start;
    }

    .img-holder {
      width: 36px;
      height: 36px;
      min-width: 36px;
      /* margin: 0 9px 0 0; */
    }

    .wrap {
      min-width: 0;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      @media (max-width: 500px) {
        flex-wrap: wrap;
      }
    }

    .title-area {
      padding: 0 10px 0 0;

      @media (max-width: 500px) {
        width: 100%;
      }
    }

    .title {
      display: block;
      font-weight: 500;
      color: var(--pallete-primary-main);
      margin: 0 0 7px;
      .sp_dark & {
        color: #fff;
      }

      @media (max-width: 500px) {
        padding-right: 70px;
        margin: 0 0 4px;
      }
    }

    .date {
      display: block;
      font-size: 12px;
      line-height: 15px;
      margin: 0;
      color: var(--pallete-text-secondary-300);
      font-weight: 400;

      .sp_dark & {
        color: rgba(255, 255, 255, 0.6);
      }

      @media (max-width: 500px) {
        margin: 0 0 5px;
      }

      time {
        /* margin: 0 0 0 5px; */
        color: var(--pallete-text-main-150);
        font-size: inherit;
        line-height: inherit;
        font-weight: 500;

        &.date-schedule {
          margin: 0 0 0 5px;
        }

        .sp_dark & {
          color: #d0d0d0;
        }
      }

      .img-calendar {
        margin: -2px 8px 0 0;
        display: inline-block;
        vertical-align: top;
        opacity: 0.4;
      }

      span {
        color: currentColor;
      }
    }

    .widget-right-area {
      text-align: right;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;

      .date {
        margin: 0;
      }
    }

    .status {
      margin: 0 0 10px;
      font-size: 11px;
      line-height: 14px;
      display: inline-block;
      min-width: inherit;
      vertical-align: top;
      /* color: #fff; */

      @media (max-width: 500px) {
        text-align: left;
        position: absolute;
        right: 12px;
        top: 12px;
        margin: 0;
      }

      &.progress {
        /* color: #3dd13a; */
        height: auto;
        border-radius: 0;
        background: none;

        .status-img {
          color: #99dbf3;
        }

        span {
          margin-top: 2px;

          &:before {
            display: inline-block;
          }
        }
      }

      &.completed {
        /* color: var(--pallete-text-main-100); */

        .status-img {
          color: #e51075;

          path {
            display: none;
          }
        }
      }

      &.pending {
        /* color: var(--pallete-primary-main); */

        .status-img {
          color: #f1c232;
        }
      }

      &.cancelled {
        /* color: #aeb1d4; */

        .status-img {
          color: #c2c2c2;
        }
      }

      span {
        /* width: 10px;
        height: 10px;
        font-size: inherit;
        margin: 0 0 0 4px;
        color: currentColor;
        display: inline-block;
        vertical-align: top; */
        svg {
          width: 100%;
          height: auto;
          circle {
            .sp_light & {
              fill: currentColor;
              stroke: currentColor;
            }
            .sp_dark & {
              fill: currentColor;
              stroke: currentColor;
            }
          }
        }

        &:before,
        &:after {
          /* margin: 0;
          display: none;
          background: currentColor; */
        }
      }
    }

    .users-list {
      display: flex;
      margin: 0 25px 0 0;

      @media (max-width: 500px) {
        display: none;
      }

      .user-image {
        width: 34px;
        height: 34px;
        border-radius: 3px;
        margin: 0 2px;
        position: relative;
        overflow: hidden;
        .video_thumbnail {
          width: 100%;
          height: 100%;
          .icon-play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            z-index: 2;
          }

          svg {
            height: auto;
            width: 100%;

            circle {
              fill: #333;
            }
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-counter {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 15px;
        line-height: 18px;
        font-weight: 500;
        background: rgba(0, 0, 0, 0.6);
      }
    }
  }
`;
