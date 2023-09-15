/* tslint:disable */
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from 'theme/logo';

const Basic: React.FC<any> = ({ children }) => {
  const [open, setopen] = useState(false);

  return (
    <>
      <style>
        {`
          .pre-loader {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: var(--pallete-background-default);
            z-index: 99;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-transition: all 0.4s ease;
            transition: all 0.4s ease;
          }

          .loaded .pre-loader {
            opacity: 0;
            visibility: hidden;
          }

          .page-template {
            overflow: hidden;
          }

          .loaded .page-template {
            overflow: visible;
          }

          .page-template .footer-opener {
            top: 20px;
          }

          .loading-logo {
            width: 260px;
            display: block;
            -webkit-animation: animateScale 2s ease-in-out infinite alternate;
            animation: animateScale 2s ease-in-out infinite alternate;
          }

          .loading-logo svg {
            width: 100%;
            height: auto;
            vertical-align: top;
          }

          .content-block {
            font-size: 16px;
            line-height: 1.3125;
            border-top: 1px solid #f7f7f7;
            color: #242529;
            font-weight: 400;
          }

          .content-block__h1 {
            padding: 15px 0;
            border-bottom: 1px solid rgba(138, 150, 163, 0.25);
            font-size: 19px;
            line-height: 22px;
            text-transform: uppercase;
            color: #242529;
            font-weight: 500;
            margin: 0 0 28px;
          }

          .content-block__h2 {
            font-size: 26px;
            line-height: 30px;
            font-weight: 300;
            margin: 0 0 31px;
          }

          .content-block a {
            color: #e61c7c;
          }

          .content-block a:hover {
            color: #02b0f0;
          }

          .content-block__content {
            padding: 0 0 30px;
          }

          .content-block__wrap {
            position: relative;
            overflow: hidden;
            margin: 0 0 31px;
          }

          .content-block time {
            display: block;
            font-weight: 500;
            margin: 0 0 31px;
          }

          .content-block strong {
            font-weight: 500;
          }

          .content-block p {
            margin: 0 0 10px;
          }

          .content-block .title {
            display: block;
            margin: 0 0 10px;
          }

          .content-block ul {
            padding-left: 16px;
          }

          @-webkit-keyframes animateScale {
            0% {
              -webkit-transform: scale(1);
              transform: scale(1);
            }

            100% {
              -webkit-transform: scale(1.4);
              transform: scale(1.4);
            }
          }

          @keyframes animateScale {
            0% {
              -webkit-transform: scale(1);
              transform: scale(1);
            }

            100% {
              -webkit-transform: scale(1.4);
              transform: scale(1.4);
            }
          }

          @media (max-width: 767px) {
            .content-block__content {
              padding: 0;
            }
          }
        `}
      </style>

      <div id="wrapper" className={`${open ? 'footer-active' : ''}`}>
        {/* <div className="pre-loader">
          <div className="pre-loader-holder">
            <strong className="loading-logo">
              <Logo />
            </strong>
          </div>
        </div> */}
        <header id="header">
          <div className="container-fluid d-flex align-items-center justify-content-between py-15 py-md-5">
            <strong className="logo">
              <Link to="/">
                <Logo />
              </Link>
            </strong>

            <span
              className="footer-opener"
              onClick={() => setopen((state) => !state)}
            ></span>
          </div>
        </header>

        {children}

        <div className="footer-menu">
          <div className="footer-menu-wrap">
            <div className="container">
              <ul className="footer-list">
                <li className="d-none d-md-block">
                  &copy; {dayjs().format('YYYY')}{' '}
                  <span className="f-logo">
                    <Logo />
                  </span>{' '}
                  Inc.
                </li>
              </ul>

              <ul className="footer-list">
                <li>
                  <Link to="/terms" target="_blank">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/policy" target="_blank">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Styled = styled(Basic)`
  .pre-loader {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: var(--pallete-background-default);
    z-index: 99;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-transition: all 0.4s ease;
    transition: all 0.4s ease;
  }

  .loaded .pre-loader {
    opacity: 0;
    visibility: hidden;
  }

  .page-template {
    overflow: hidden;
  }

  .loaded .page-template {
    overflow: visible;
  }

  .page-template .footer-opener {
    top: 20px;
  }

  .loading-logo {
    width: 260px;
    display: block;
    -webkit-animation: animateScale 2s ease-in-out infinite alternate;
    animation: animateScale 2s ease-in-out infinite alternate;
  }

  .loading-logo svg {
    width: 100%;
    height: auto;
    vertical-align: top;
  }

  .content-block {
    font-size: 16px;
    line-height: 1.3125;
    border-top: 1px solid #f7f7f7;
    color: #242529;
    font-weight: 400;
  }

  .content-block__h1 {
    padding: 15px 0;
    border-bottom: 1px solid rgba(138, 150, 163, 0.25);
    font-size: 19px;
    line-height: 22px;
    text-transform: uppercase;
    color: #242529;
    font-weight: 500;
    margin: 0 0 28px;
  }

  .content-block__h2 {
    font-size: 26px;
    line-height: 30px;
    font-weight: 300;
    margin: 0 0 31px;
  }

  .content-block a {
    color: #e61c7c;
  }

  .content-block a:hover {
    color: #02b0f0;
  }

  .content-block__wrap {
    position: relative;
    overflow: hidden;
    margin: 0 0 31px;
  }

  .content-block time {
    display: block;
    font-weight: 500;
    margin: 0 0 31px;
  }

  .content-block strong {
    font-weight: 500;
  }

  .content-block p {
    margin: 0 0 10px;
  }

  .content-block .title {
    display: block;
    margin: 0 0 10px;
  }

  .content-block ul {
    padding-left: 16px;
  }

  @-webkit-keyframes animateScale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    100% {
      -webkit-transform: scale(1.4);
      transform: scale(1.4);
    }
  }

  @keyframes animateScale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    100% {
      -webkit-transform: scale(1.4);
      transform: scale(1.4);
    }
  }
`;

export default Styled;
