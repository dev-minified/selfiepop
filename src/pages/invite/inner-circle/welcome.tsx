import { AvatarName, LogoUpdated } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Invitation from '../../../layout/invitation';

const Welcome: React.FC<{
  className?: string;
  user: IUser;
  next: () => void;
  gotoSignUp: () => void;
  sliderNumber: number;
}> = ({ className, user, next }) => {
  return (
    <div className={className}>
      <Invitation>
        <div className="profile-image">
          {user?.profileImage && (
            <ImageModifications
              imgeSizesProps={{
                onlyDesktop: true,

                imgix: { all: 'w=163&h=163' },
              }}
              src={user?.profileImage}
              fallbackComponent={
                <AvatarName text={user.pageTitle || 'Incognito User'} />
              }
              alt=""
            />
          )}
        </div>
        <div className="profile--info mb-20">
          <h1>{user?.pageTitle ?? 'Incognito User'}</h1>
          <h2>Has given you access to the</h2>
          <div className="logo-holder">
            <LogoUpdated />
          </div>
          <h6>Inner Circle</h6>
          <Link to="#">
            <Button type="primary" onClick={next}>
              START HERE
            </Button>
          </Link>
        </div>
        <div className="video-holder">
          <video
            style={{ width: '100%' }}
            poster="/assets/images/inner-slide1.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source
              src="https://d1i1apkb1v314l.cloudfront.net/vid-pops/inner-circle/01_background.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </Invitation>
    </div>
  );
};

export default styled(Welcome)`
  height: 100%;
  position: relative;
  background: #000;
  color: #fff;
  text-align: center;
  overflow: hidden;

  .video-holder {
    position: absolute;
    left: -2vh;
    right: -2vh;
    top: 0;
    bottom: 0;
  }

  .profile-image {
    position: relative;
    z-index: 3;
    width: 24vh;
    height: 24vh;
    border-radius: 100%;
    overflow: hidden;
    margin: 17vh auto 0;

    @media (min-height: 800px) {
      margin-top: 19.5vh;
    }

    @media (min-height: 820px) {
      margin-top: 18vh;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content-parent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .profile--info {
    position: relative;
    z-index: 3;
    padding-bottom: 90px;
  }

  h1 {
    font-size: 3.6vh;
    margin: 0 0 1.4vh;
  }

  h2 {
    font-size: 2.2vh;
    margin: 0 0 1vh;
  }

  .logo-holder {
    width: 22vh;
    margin: 0 auto;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  video {
    height: 100%;
    + img {
      opacity: 0;
      visibility: hidden;
    }
  }

  .button {
    padding: 1.2vh 3vh;
    font-size: 2.6vh;
  }

  h6 {
    line-height: 1.6;
    font-size: 3vh;
    margin: 0 0 2vh;
  }

  .my-btn:hover,
  .my-btn:focus {
    background: #1f295b !important;
    border-color: #1f295b !important;
  }
`;
