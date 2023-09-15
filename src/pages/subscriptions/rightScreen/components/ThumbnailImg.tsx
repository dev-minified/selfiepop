import {
  Advertise,
  CoursePlaceholder,
  FanPagePlaceholder,
  Payma,
  PopLive,
  Shoutout,
} from 'assets/svgs';
import Image from 'components/Image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { ReactElement } from 'react';
import styled from 'styled-components';

export const getAdvertisementPlaceholder = (type?: any) => {
  switch (type) {
    case 'shoutout':
      return (
        <span className="shoutout img-placeholder">
          <span className="img">
            <Shoutout />
          </span>
        </span>
      );
    case 'payma':
      return (
        <span className="payma img-placeholder">
          <span className="img">
            <Payma />
          </span>
        </span>
      );
    case 'poplive':
      return (
        <span className="poplive img-placeholder">
          <span className="img">
            <PopLive />
          </span>
        </span>
      );
    case 'digital-download':
      return (
        <span className="digital-download img-placeholder">
          <span className="img">
            <Advertise />
          </span>
        </span>
      );
    case 'chat-subscription':
      return (
        <span className="chat-subscription img-placeholder">
          <span className="img">
            <FanPagePlaceholder />
          </span>
        </span>
      );
    case 'pop-course':
      return (
        <span className="pop-course img-placeholder">
          <span className="img">
            <CoursePlaceholder />
          </span>
        </span>
      );
    default:
      return (
        <span className="default img-placeholder">
          <span className="img">
            {' '}
            <FanPagePlaceholder />
          </span>
        </span>
      );
  }
};
dayjs.extend(utc);
dayjs.extend(relativeTime);

interface Props {
  className?: string;
  isBuyer?: boolean;
  user?: ChatUserType;
  src?: string;
  caption?: string;
  type?: string;
  tag?: string | number;
  onClick?: any;
  fallbackUrl?: string;
}

function Thumbnail({
  className,
  src,
  caption = '',
  tag,
  onClick,
  type,
  fallbackUrl,
}: Props): ReactElement {
  return (
    <div className={`${className} image-thumbnail`} onClick={onClick}>
      <div className="thumbImage">
        <div className="icon">
          {src ? (
            <Image src={src} fallbackUrl={fallbackUrl} />
          ) : (
            getAdvertisementPlaceholder(type)
          )}
        </div>
        {/* <Image src={src || '/assets/images/default-profile-img.svg'} /> */}
      </div>

      <div className="caption">
        {caption && <div className="caption-text">{caption}</div>}
        {tag && <span className="tag">${tag}</span>}
      </div>
    </div>
  );
}

export default styled(Thumbnail)`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  margin: 0 auto 12px;
  max-width: 320px;

  .img-placeholder {
    height: 125px;
    background: var(--pallete-background-secondary-light);
    display: block;
    overflow: hidden;

    .img {
      margin: 20px auto 0;
      width: 58px;
      height: 58px;
      border-radius: 100%;
      background: #eceff6;
      overflow: hidden;
      display: block;

      .sp_dark & {
        fill: #000;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    }

    #Layer_1 {
      fill: #eceff6;

      .sp_dark & {
        fill: #000;
      }
    }

    #Layer_2 {
      fill: #fff;

      .sp_dark & {
        fill: var(--pallete-background-secondary-light);
      }
    }
  }

  .tag {
    /* background: rgba(0, 0, 0, 0.7);
    padding: 6px 5px;
    text-align: center;
    position: absolute;
    right: 10px;
    top: 10px;
    min-width: 60px;
    border-radius: 16px; */
    color: #fff;
  }

  .caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 15px;
    color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .caption-text {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0 10px 0 0;
  }

  img {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
  .thumbImage {
    cursor: pointer;
  }
`;
