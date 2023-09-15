import { PrivateIconLock, StarBackground } from 'assets/svgs';
import { ReactNode } from 'react';
import styled from 'styled-components';
interface IPrivatePost {
  className?: string;
  title?: ReactNode;
  subTitle?: ReactNode;
}

const PrivatePost: React.FunctionComponent<IPrivatePost> = ({
  className,
  title,
  subTitle,
}) => {
  return (
    <div className={className}>
      <div className="private_post_bg">
        <div className="star-bg">
          <StarBackground />
        </div>
        <div className="lock_icon">
          <div className="img-lock">
            <PrivateIconLock />
          </div>
          <h3>{title || 'Private Profile'}</h3>
          <p>{subTitle || 'Upgrade membership to access this content'}</p>
        </div>
      </div>
    </div>
  );
};

export default styled(PrivatePost)`
  padding: 20px 20px 12px;
  color: #7d7d7d;
  font-weight: 400;

  .sp_dark & {
    color: rgba(255, 255, 255, 0.6);
  }

  .star-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: -1;

    svg {
      width: 100%;
      height: auto;
    }

    path {
      .sp_dark & {
        fill: rgba(229, 16, 117, 0.08);
      }
    }
  }

  .img-lock {
    width: 93px;
    margin: 0 auto 19px;

    img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }

    circle {
      .sp_dark & {
        fill: #303030;
      }
    }

    path {
      .sp_dark & {
        fill: #fff;
      }
    }
  }

  .lock_icon {
    text-align: center;
  }

  h3 {
    font-size: 22px;
    line-height: 1;
    margin: 0 0 3px;
    font-weight: 500;
  }

  p {
    margin: 0;
  }
`;
