/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames';
import GallaryViewModal from 'components/PrivatePageComponents/GallaryViewModal';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import EmailForm from './components/EmailForm';
import Footer from './components/Footer';

import { checkUserProfile } from 'api/User';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { getUserCount } from 'store/reducer/counter';
import 'styles/landing.css';
import { parseQuery } from 'util/index';
import Header from './components/Header';
import Hero from './components/Hero';
import MobileSliding from './components/MobileSliding';
import Success from './components/Success';
import Users from './components/Users';
const Home: React.FC<{ className?: string }> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(-1);
  const dispatch = useAppDispatch();
  const { setLoading } = useRequestLoader();
  const { loggedIn, setLoggedData, Logout, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const { token, refreshToken } = parseQuery(location.search);
  const { withLoader } = useRequestLoader();
  const isTokenedUrl = matchPath(history.location.pathname, {
    path: '/',
    exact: true,
    strict: false,
  });
  const checkifSubsExist = () => {
    setIsLoading(true);
    setLoading(true);
    dispatch(getUserCount())
      .unwrap()
      .then((d: any) => {
        setIsLoading(false);
        setLoading(false);
        if (!d.cancelled) {
          if (!!d?.subscription) {
            history.replace('/messages/subscriptions');
            return;
          }
        }
        history.push('/my-profile');
      })
      .catch(() => {
        setIsLoading(false);
        setLoading(false);
        history.push('/my-profile');
      });
  };
  const LoogedUser = async () => {
    if (isTokenedUrl && token && refreshToken) {
      setIsLoading(true);
      await Logout(false);
      withLoader(
        checkUserProfile(token as string)
          .then(async (data) => {
            setLoggedData({ data, token, refreshToken });
            history.push('/my-profile');
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            if (loggedIn) {
              history.push('/my-profile');
            }
          }),
      );
    } else if (loggedIn) {
      checkifSubsExist();
    }
  };
  useEffect(() => {
    LoogedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, user?._id]);

  if (isLoading) {
    return null;
  }

  return (
    <div
      className={classNames('landing_page', className, {
        'nav-active': isMenuOpen,
      })}
    >
      <Header className="landing__header" setIsMenuOpen={setIsMenuOpen} />
      <main className="sp-main">
        <section className="sp-visual" id="features">
          <div className="sp-ellipses-holder">
            <div className="sp-ellipse-right"></div>
            <div className="sp-ellipse-left"></div>
          </div>
          <Hero />
          <MobileSliding onPlay={() => setSlideIndex(0)} />
        </section>

        <Users id="users" />
        <Success id="success" />

        <EmailForm id="get-started" />
      </main>
      <Footer />
      <GallaryViewModal
        className="gallaryswiper"
        isOpen={slideIndex !== -1}
        items={[
          {
            url: 'https://youtu.be/sWRUzxINCoA',
            src: 'https://youtu.be/sWRUzxINCoA',
            thumb: '',
            id: 'video-adad',
            type: 'video/mp4',
          },
        ]}
        currentSlideIndex={slideIndex}
        onCloseModel={() => {}}
        onClose={() => setSlideIndex(-1)}
      />
    </div>
  );
};

export default styled(Home)`
  font-family: 'Open Sans', sans-serif;
  color: var(--pallete-background-black);
  font-size: 18px;
  line-height: 1.2;
  font-weight: 400;
  padding-top: 75px;

  h1,
  h2,
  h3,
  h4 {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
  }

  h1 {
    font-size: 75px;
    line-height: 1.2;

    @media (max-width: 991px) {
      font-size: 60px;
    }

    @media (max-width: 767px) {
      font-size: 55px;
    }

    @media (max-width: 479px) {
      font-size: 44px;
    }
  }

  h2 {
    font-size: 70px;

    @media (max-width: 991px) {
      font-size: 55px;
    }

    @media (max-width: 767px) {
      font-size: 45px;
    }

    @media (max-width: 479px) {
      font-size: 35px;
    }
  }

  h3 {
    font-size: 38px;

    @media (max-width: 1439px) {
      font-size: 32px;
      line-height: 1.3;
    }

    @media (max-width: 479px) {
      font-size: 28px;
    }
  }

  h4 {
    font-size: 20px;
  }

  img {
    max-width: 100%;
  }

  a:not(.sp-button):not(.sp-button-small) {
    text-decoration: none;
    transition: all 0.4s ease;
    color: var(--pallete-background-black);

    &:hover {
      color: var(--pallete-primary-darker);
    }
  }

  .sp-container {
    max-width: 1280px;
    padding: 0 18px;
    margin: 0 auto;
    width: 100%;
  }

  .sp-button {
    min-width: 180px;
    padding: 13px 20px;
    border-radius: 5px;
    background-color: #e51075;
    transition: letter-spacing 300ms ease;
    color: #fff;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0;
    text-decoration: none;
    display: inline-block;
    vertical-align: top;

    &:hover {
      letter-spacing: 1px;
    }
  }

  .sp_login {
    background: #000;
    min-width: 130px;
    margin-left: 20px;

    @media (max-width: 767px) {
      margin-left: 10px;
    }

    .sp_dark & {
      background: rgba(31, 31, 31, 1);
    }
  }

  .sp-button-small {
    min-width: 180px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: #141415;
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
    vertical-align: top;
    padding: 13px 20px;
    color: #fff;
    text-decoration: none;

    &:hover {
      background: #212121;
    }
  }

  .sp-ellipses-holder {
    position: absolute;
    left: 0%;
    top: 0%;
    right: 0%;
    bottom: 0%;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;

    .sp-ellipse-right {
      position: absolute;
      left: auto;
      top: 0%;
      right: -530px;
      bottom: auto;
      z-index: -1;
      width: 650px;
      height: 650px;
      background-image: url('/assets/images/landing-page/ellipse-2.png');
      background-position: 50% 50%;
      background-size: cover;
      background-repeat: no-repeat;
      animation: rotate-animation 25s linear infinite;

      @media (max-width: 479px) {
        left: 75vw;
        top: 20%;
        right: auto;
        width: 350px;
        height: 350px;
      }
    }

    .sp-ellipse-left {
      position: absolute;
      left: -430px;
      top: 5em;
      right: auto;
      bottom: auto;
      z-index: -1;
      width: 520px;
      height: 650px;
      background-image: url('/assets/images/landing-page/ellipse-1.png');
      background-position: 50% 50%;
      background-size: cover;
      background-repeat: no-repeat;
      animation: rotate-animation 25s linear infinite;

      @media (max-width: 479px) {
        left: -60%;
        top: 20%;
        width: 320px;
        height: 350px;
      }
    }
  }

  @-webkit-keyframes rotate-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }

  @keyframes rotate-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }

  .sp-visual {
    position: relative;
    padding-top: 3em;

    @media (max-width: 991px) {
      padding-top: 1em;
    }
  }

  .sp-visual-container {
    display: flex;
    overflow: hidden;
    width: 100%;
    min-height: 70vh;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 991px) {
      padding: 0 18px;
    }
  }

  .sp-small-container {
    position: relative;
    display: flex;
    max-width: 900px;
    margin-right: auto;
    margin-left: auto;
    flex-direction: column;
    align-items: center;
  }

  .block-users {
    background: var(--pallete-background-secondary-light);
    padding: 68px 0 96px;

    @media (max-width: 767px) {
      padding: 68px 0 32px;
    }

    .sp-block-head {
      text-align: center;
      margin: 0 0 40px;
      position: relative;
      overflow: hidden;

      p {
        max-width: 50%;
        margin: 0 auto 10px;

        @media (max-width: 991px) {
          max-width: 512px;
        }
      }
    }

    h2 {
      font-weight: 800;
      color: var(--pallete-text-main);
      margin: 0 0 10px;
    }

    .sp-two-cols {
      margin: 0 -18px;
      display: flex;
      flex-wrap: wrap;

      @media (max-width: 991px) {
        margin: 0 -9px;
      }

      @media (max-width: 767px) {
        margin: 0 -18px;
      }

      .sp-col-holder {
        padding: 0 18px 36px;
        width: 44.4%;

        @media (max-width: 991px) {
          padding: 0 9px 18px;
        }

        @media (max-width: 767px) {
          width: 100%;
          padding: 0 18px 36px;
        }

        &:first-child {
          width: 55.6%;

          @media (max-width: 767px) {
            width: 100%;
          }
        }

        &:nth-child(2) {
          .sp-article {
            flex-direction: column-reverse;
          }
        }
      }
    }

    .sp-three-cols {
      margin: 0 -18px;
      display: flex;
      flex-wrap: wrap;

      @media (max-width: 991px) {
        margin: 0 -9px;
      }

      @media (max-width: 767px) {
        margin: 0 -18px;
      }

      .sp-col-holder {
        width: 33.333%;
        padding: 0 18px;

        @media (max-width: 991px) {
          padding: 0 9px;
        }

        @media (max-width: 767px) {
          padding: 0 18px;
          width: 100%;
          margin: 0 0 36px;
        }
      }

      .sp-service-box {
        height: 100%;
        background: var(--pallete-background-gray-secondary-150);
        border-radius: 20px;
        box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.05);
        padding: 36px;
        text-align: center;

        @media (max-width: 991px) {
          padding: 25px 18px;
        }

        @media (max-width: 767px) {
          padding: 36px;
        }
      }

      .img-holder {
        margin: 0 0 14px;

        img {
          height: 65px;
          width: auto;
        }
      }

      h4 {
        margin: 0 0 10px;
        font-weight: 700;
      }

      p {
        margin: 0 0 10px;
      }
    }

    .sp-article {
      background: var(--pallete-background-gray-secondary-150);
      border-radius: 20px;
      box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.05);
      overflow: hidden;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .text-holder {
        padding: 46px 36px;

        @media (max-width: 991px) {
          padding: 20px;
        }

        @media (max-width: 767px) {
          padding: 46px 36px;
        }
      }

      h3 {
        margin: 0 0 10px;
      }

      p {
        margin: 0 0 10px;
      }
    }
  }

  .block-success {
    padding: 48px 0;
    font-size: 24px;

    @media (max-width: 767px) {
      padding: 48px 0 0;
      font-size: 18px;
    }

    .sp-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      position: relative;
    }

    .sp-heading-box {
      position: sticky;
      top: 0;
      width: 49.3%;
      padding: 100px 0 70px;

      @media (max-width: 767px) {
        padding: 0 0 60px;
        position: static;
        width: 100%;
      }

      h2 {
        margin: 0 0 10px;
      }

      p {
        margin: 0 0 10px;

        br {
          @media (max-width: 1023px) {
            display: none;
          }
        }
      }
    }

    .sp-text-block {
      width: 50.7%;
      padding: 70vh 0 0 18px;
      position: relative;

      @media (max-width: 767px) {
        padding: 0;
        width: 100%;
      }
    }

    .overlay-area {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      pointer-events: none;
      z-index: 2;

      @media (max-width: 767px) {
        display: none;
      }

      .overlay {
        position: sticky;
        top: 75px;
        background: linear-gradient(
          180deg,
          var(--pallete-background-default),
          hsla(0, 0%, 100%, 0)
        );
        height: 10em;

        &.overlay-bottom {
          top: 80vh;
          height: 20vh;
          background: linear-gradient(
            0deg,
            var(--pallete-background-default),
            hsla(0, 0%, 100%, 0)
          );
        }
      }
    }

    .sp-text-box {
      position: relative;
      overflow: hidden;
      margin: 0 0 calc(20vh - 36px);

      @media (max-width: 767px) {
        margin: 0 0 36px;
      }

      h2 {
        margin: 0;
        background-image: linear-gradient(128deg, #e51075, #60aef8);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.3;
      }

      p {
        margin: 0 0 36px;
      }
    }
  }

  .block-form {
    padding: 48px 0;
    background: var(--pallete-background-secondary-light);

    .sp-form-area {
      padding: 56px 36px;
      border-radius: 20px;
      background: var(--pallete-background-gray-secondary-150);
      width: 79.8%;
      margin: 0 auto;
      box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.05);

      @media (max-width: 991px) {
        width: 100%;
      }

      @media (max-width: 767px) {
        font-size: 16px;
      }
    }

    h2 {
      color: var(--pallete-text-main);
      margin: 0 0 10px;
    }

    p {
      margin: 0 0 28px;
    }
  }

  .sp-form-subscribe {
    position: relative;

    input[type='text'],
    input[type='email'] {
      width: 100%;
      border-radius: 20px;
      font-size: 25px;
      height: 70px;
      border: 1px solid #dadada;
      background: rgba(244, 248, 251, 0.25);
      outline: none;
      box-shadow: none;
      padding: 10px 120px 10px 15px;
      transition: all 0.4s ease;

      @media (max-width: 479px) {
        height: 60px;
        font-size: 18px;
        padding: 10px 15px;
        border-radius: 10px;
      }

      &::placeholder {
        color: rgba(0, 0, 0, 0.2);
      }

      &:focus {
        border-color: #fa5853;
      }
    }

    button[type='submit'] {
      border: none;
      outline: none;
      box-shadow: none;
      position: absolute;
      right: 5px;
      top: 5px;
      height: 60px;
      min-width: 100px;
      border-radius: 20px;
      background: linear-gradient(90deg, #fa5853, #f46692 50%, #ffc444);
      cursor: pointer;

      @media (max-width: 479px) {
        position: static;
        width: 100%;
        margin: 5px 0 0;
        border-radius: 10px;
      }

      &:hover {
        img {
          margin: 0 0 0 5px;
        }
      }

      img {
        transition: all 0.4s ease;
      }
    }
  }

  .sp-footer {
    padding: 48px 0;

    .sp-title {
      padding: 0 9px 0 0;
    }

    .sp-bottom-area {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: #727272;

      @media (max-width: 991px) {
        display: block;
      }
    }

    .sp-left-area {
      display: flex;
      align-items: center;

      @media (max-width: 991px) {
        margin: 0 0 5px;
      }

      @media (max-width: 767px) {
        display: block;
      }
    }

    .sp-f-logo {
      width: 110px;
      margin: 0 27px 0 0;
      display: block;

      @media (max-width: 767px) {
        margin: 0 0 18px;
      }

      a {
        display: block;
      }

      img,
      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .sp-footer-links {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;

      @media (max-width: 767px) {
        display: block;
        margin: 0 0 18px;
      }

      li {
        padding: 0 9px;

        @media (max-width: 767px) {
          padding: 0;
          margin: 0 0 10px;
        }
      }
    }

    p {
      margin: 0;

      a {
        font-weight: 700;
        color: #787878;
      }

      .f-logo {
        width: 80px;
        height: auto;
        display: inline-block;
        vertical-align: middle;
        margin: -2px 0 0;

        svg {
          width: 100%;
          height: auto;
          display: block;
        }
      }
    }
  }

  .form-block {
    .form-control {
      &::placeholder {
        color: #ccc !important;
      }
    }
  }
`;
