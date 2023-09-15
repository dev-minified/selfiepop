import { AvatarName, ProfleTickIcon } from 'assets/svgs';
import classNames from 'classnames';
import ImageModifications from 'components/ImageModifications';
import React from 'react';
import styled from 'styled-components';
interface Props {
  className?: string;
  img?: string;
  heading?: string;
  onClick?: Function;
  btnText?: string;
  coverImg?: string;
  username?: string;
  isUserVerified?: boolean;
}

const ProfileCard: React.FC<Props> = (Props) => {
  const {
    className,
    img,
    heading,
    coverImg,
    onClick,
    username,
    isUserVerified,
  } = Props;
  return (
    <div
      className={classNames(className, 'profile-card')}
      onClick={() => onClick?.()}
    >
      <div className="bg-img">
        <ImageModifications
          imgeSizesProps={{ onlyMobile: true }}
          src={coverImg || '/assets/images/default-profile-img.svg'}
          fallbackUrl={'/assets/images/default-profile-img.svg'}
        />
      </div>
      <div className="suggested-user-details">
        <div className="image-holder">
          <ImageModifications
            imgeSizesProps={{ onlyMobile: true }}
            // src={img || '/assets/images/default-profile-img.svg'}
            src={img}
            // fallbackUrl={'/assets/images/default-profile-img.svg'}
            fallbackComponent={
              <AvatarName text={heading || 'Incongnito User'} />
            }
          />
        </div>
        <div className="text-holder">
          <strong className="title">
            {heading}{' '}
            {isUserVerified && (
              <ProfleTickIcon width="12" height="12" fill="#fff" />
            )}
          </strong>
          <div className="name-area">
            {username ? <span className="user-name">@{username}</span> : null}
          </div>
          {/* {btnText && (
            <Button size="small" shape="circle" onClick={() => onClick?.()}>
              {btnText}
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default styled(ProfileCard)`
  min-height: 120px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  padding-top: 52px;
  color: #fff;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .bg-img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .suggested-user-details {
    display: flex;
    align-items: center;
    padding: 6px 12px 6px 120px;
    background: rgba(0, 0, 0, 0.4);
    min-height: 60px;
  }

  .name-area {
    display: flex;
    align-items: center;

    svg {
      display: inline-block;
      vertical-align: middle;
      margin: 0 0 0 5px;
    }
  }

  .image-holder {
    width: 108px;
    min-width: 108px;
    height: 108px;
    border-radius: 100%;
    overflow: hidden;
    position: absolute;
    left: 12px;
    bottom: 6px;

    .image-comp {
      border: 3px solid #ffffff;
      border-radius: 100%;
      overflow: hidden;

      &.defaultImage {
        border-color: #303030;
      }

      circle {
        fill: #191919;
      }
    }

    img {
      border-radius: 100%;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .text-holder {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 0 0 3px 9px;
  }

  .title {
    display: block;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
    margin: 0 0 1px;

    svg {
      width: 16px;
      height: auto;
      display: inline-block;
      vertical-align: middle;
      margin: 0 0 0 8px;
    }
  }

  .user-name {
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    color: #d0d0d0;
    opacity: 0.8;
  }

  /* border: 1px solid #e6ebf5;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  background: var(--pallete-background-default);

  .image-holder {
    width: 90px;
    height: 90px;
    border-radius: 100%;
    overflow: hidden;
    margin: 0 auto 8px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    display: block;
    margin: 0 0 10px;
    color: #7c5b87;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
  }

  .button {
    &.button-sm {
      min-width: 98px;
      font-size: 12px;
      line-height: 15px;
    }
  } */
`;
