import ImageModifications from 'components/ImageModifications';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import React from 'react';
import styled from 'styled-components';
dayjs.extend(advancedFormat);

interface Props {
  className?: string;
  message: string;
  from: string;
  timestamp: string;
  image: string;
}

const ChatBubble: React.FC<Props> = (props) => {
  const { className, message, from, image, timestamp } = props;
  return (
    <div className={className}>
      <div className="box-wrap">
        <div
          style={{
            width: '50px',
            height: '50px',
          }}
        >
          <ImageModifications
            fallbackUrl={'/assets/images/default-profile-img.svg'}
            src={image || '/assets/images/default-profile-img.svg'}
            alt="profile"
            imgeSizesProps={{
              onlyMobile: true,

              imgix: { all: 'w=163&h=163' },
            }}
          />
        </div>
        <div className="text-holder">
          <div className="name-area">
            <strong className="name">{from}</strong>
            <span className="time">
              {dayjs(timestamp).format('dddd MMMM Do, h:mm A')}
            </span>
          </div>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default styled(ChatBubble)`
  padding: 16px 18px 9px;
  border: 1px solid var(--pallete-colors-border);
  border-radius: 4px;
  margin: 0 0 25px;
  font-size: 15px;
  line-height: 23px;
  font-weight: 400;
  color: var(--pallete-text-light-100);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);

  .box-wrap {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    img {
      border-radius: 50%;
    }
  }

  .image-comp {
    min-widht: 44px;
    width: 44px;
    height: 44px;
    border-radius: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .text-holder {
    width: calc(100% - 44px);
    padding: 0 0 0 10px;
  }

  .name-area {
    font-weight: 500;
    margin: 0 0 4px;
  }

  .name {
    display: inline-block;
    vertical-align: top;
    font-weight: 500;
    padding: 0 20px 0 0;
  }

  .time {
    display: inline-block;
    vertical-align: top;
    color: #716b76;
  }

  p {
    margin: 0 0 10px;
  }
`;
