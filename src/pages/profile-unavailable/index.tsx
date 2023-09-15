import { Logo } from 'assets/svgs';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ProfileUnavailable: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={className}>
      <div className="notfound">
        <div className="notfound__wrap">
          <div className="notfound__area">
            <div className="notfound__frame">
              <div className="img-smiley">
                <img src="/assets/images/img-smiley.png" alt="sad face" />
              </div>
              <h3>
                <span className="heading-text">Sorry,</span>this profile is
                unavailable.
              </h3>
              <p>
                Go back to <Link to="/">selfiepop.com</Link>
              </p>
            </div>
          </div>
          <div className="logo-holder">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default styled(ProfileUnavailable)`
  .notfound {
    background: #02a4e0;
    min-height: 100vh;
    display: flex;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;

    &__wrap {
      min-height: inherit;
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }

    &__area {
      max-width: 500px;
      padding: 30px 15px 15px;
      width: 100%;
      margin: 0 auto;
      flex-grow: 1;
      flex-basis: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__frame {
    }
  }

  .logo-holder {
    width: 115px;
    margin: 0 0 30px;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }

    path {
      fill: #fff !important;
      opacity: 1 !important;
    }
  }

  .img-smiley {
    width: 119px;
    margin: 0 auto 30px;

    img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  h3 {
    font-size: 31px;
    line-height: 34px;
    font-weight: 400;
    margin: 0 0 21px;

    @media (max-width: 767px) {
      font-size: 22px;
      line-height: 26px;
    }

    .heading-text {
      display: block;
      font-size: 44px;
      line-height: 46px;
      font-weight: 500;
      margin: 0 0 16px;
    }
  }

  p {
    margin: 0;
  }

  a {
    color: #fff;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`;
