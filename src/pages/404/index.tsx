import { Logo, Star } from 'assets/svgs';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Page404: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <div className="notfound">
        <div className="notfound__wrap">
          <div className="notfound__area">
            <div className="logo-holder">
              <Logo />
            </div>
            <h1>
              <span>4</span>
              <span className="star-holder">
                <Star />
              </span>
              <span>4</span>
            </h1>
            <h3>
              <span className="heading-text">Oops!</span> Something went
              wrong....
            </h3>
            <p>
              Go back to <Link to="/">selfiepop.com</Link>&nbsp;for help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default styled(Page404)`
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
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    &__area {
      max-width: 400px;
      padding: 15px;
      width: 100%;
      margin: 0 auto;
    }
  }

  .logo-holder {
    width: 275px;
    margin: 0 auto 51px;

    @media (max-width: 479px) {
      width: 240px;
      margin: 0 auto 30px;
    }

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

  h1 {
    font-size: 152px;
    line-height: 110px;
    font-weight: 500;
    max-width: 326px;
    margin: 0 auto 45px;
    padding: 20px 0;
    border-top: 3px solid #fff;
    border-bottom: 3px solid #fff;

    @media (max-width: 479px) {
      font-size: 100px;
      line-height: 74px;
      margin: 0 auto 30px;
    }

    span {
      display: inline-block;
      vertical-align: top;
    }

    .star-holder {
      width: 110px;
      height: 110px;
      border-radius: 100%;
      background: #fff;
      position: relative;
      margin: 0 10px;
      overflow: hidden;

      @media (max-width: 479px) {
        width: 74px;
        height: 74px;
      }

      svg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #02a4e0;
        width: 76px;
        height: 76px;

        @media (max-width: 479px) {
          width: 60px;
          height: 60px;
        }

        #Layer_2 {
          fill: #02a4e0;
        }
      }
    }
  }

  h3 {
    font-size: 28px;
    line-height: 32px;
    font-weight: 400;
    margin: 0 0 37px;

    @media (max-width: 479px) {
      margin: 0 0 30px;
    }

    .heading-text {
      display: block;
      font-size: 42px;
      line-height: 46px;
      font-weight: 500;
      margin: 0 0 10px;
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
