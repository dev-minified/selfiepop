/* eslint-disable jsx-a11y/anchor-is-valid */
import { activateAccountRequest, checkUserProfile } from 'api/User';
import { Spinner } from 'assets/svgs';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { matchPath, useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'styles/webflow-custom.css';
import 'styles/webflow-modified.css';
import 'styles/webflow-normal.css';
import swal from 'sweetalert';
import { parseQuery } from 'util/index';
import * as yup from 'yup';

const variants = {
  initial: {
    top: '-200px',
    position: 'absolute',
  },
  animate: {
    top: '65px',
  },
  exit: {
    top: '-200px',
    position: 'absolute',
  },
};

const PreAddedSocialLinks = [
  { type: 'instagram', url: '' },
  {
    type: 'tiktok',
    url: '',
  },
  {
    type: 'twitter',
    url: '',
  },
  {
    type: 'youtube',
    url: '',
  },
  {
    type: 'facebook',
    url: '',
  },
  {
    type: 'snapchat',
    url: '',
  },
];
const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Enter your full name')
    .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter your full name'),
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  password: yup
    .string()

    .max(50)
    .min(6, 'Password should be at least 6 characters long')
    .required('Password is required'),
  sign: yup
    .bool()
    .oneOf([true], 'Accept Terms & Conditions is required')
    .required(),
});

const SignupSection: React.FC<{ signupRef: any }> = ({ signupRef }) => {
  const { loggedIn, SignUp } = useAuth();
  const history = useHistory();
  const {
    values,
    isValid,
    isSubmitting,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      sign: true,
      refId: undefined,
      isInvitedUser: false,
      isAffiliate: false,
      isActiveProfile: true,
    },
    onSubmit: async (formData: any) => {
      if (loggedIn) {
        swal({
          title: 'Already logged in',
          icon: 'success',
        }).then((data) => {
          data && history.push('/my-profile');
        });

        return;
      }
      const name = formData.fullName.replace(/\s{2,}/g, ' ').trim();
      const firstName = name.split(' ').slice(0, -1).join(' ');
      const lastName = name.split(' ').slice(-1).join(' ');

      await SignUp({
        ...formData,
        firstName,
        lastName,
        isActiveProfile: false,
        socialMediaLinks: PreAddedSocialLinks,
        frontendURL: `${window.location.protocol}//${window.location.host}/verify-email`,
        timeOffset: dayjs.tz.guess(),
      })
        .then(() => {
          // history.push(onboardingSequency[0]);
        })
        .catch((e: Error) => {
          if (e?.message.toLocaleLowerCase() === 'email already exists')
            swal({
              title: 'You already have an account!',
              text: 'Please login below, use a different email address for registration or activate your account if deactivated',
              icon: 'error',
              // buttons: ['Cancel', 'Login'],
              buttons: {
                cancel: {
                  visible: true,
                  text: 'Cancel',
                  closeModal: true,
                },
                login: {
                  visible: true,
                  text: 'Login',
                  closeModal: true,
                },
                activate: {
                  visible: true,
                  text: 'Activate',
                  closeModal: true,
                },
              },
            }).then(async (value) => {
              switch (value) {
                case 'login':
                  history.push('/login');
                  break;

                case 'activate':
                  await activateAccountRequest({
                    email: values.email,
                  })
                    .then(() => {
                      swal(
                        'Email Success!',
                        'Check your email to activate your account',
                        'success',
                      ).then(() => {
                        history.push('/login');
                      });
                    })
                    .catch((err) => {
                      swal('', err.message, 'info');
                    });

                  break;
              }
            });
        });
    },
  });

  return (
    <div className="section wf-section">
      <div className="container w-container">
        <div className="rounded bg-blue mt-35">
          <div className="mt-0 w-layout-grid main-grid inner-padding-small">
            <div
              ref={signupRef}
              id="w-node-_5e747d09-f72a-02e8-e5ae-78d2476c889c-476c889a"
              className="wrapper-call-to-action"
            >
              <h3 className="heading-form margin-bottom-xsmall">
                Start growing your social revenue today!
              </h3>
              <input
                type="submit"
                value="Get Started"
                onClick={() => history.push('/signup')}
                data-wait="Please wait..."
                className="button color-red w-button align-center "
                disabled={!isValid && isSubmitting}
              />
              <div className="form-block w-form">
                {isSubmitting && <Spinner />}
                <div className="rounded success w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="error w-form-fail">
                  <div>
                    Oops! Something went wrong while submitting the form.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC<{ className?: string }> = ({ className }) => {
  const signupRef = useRef<any>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { loggedIn, setLoggedData } = useAuth();
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

  useEffect(() => {
    if (isTokenedUrl && token) {
      setIsLoading(true);
      withLoader(
        checkUserProfile(token as string)
          .then((data) => {
            setLoggedData({ data, token, refreshToken });
            history.push('/my-profile');
          })
          .catch(() => {
            setIsLoading(false);
            if (loggedIn) {
              setIsLoading(false);
              history.push('/my-profile');
            }
          }),
      );
    } else if (loggedIn) {
      setIsLoading(false);
      history.push('/my-profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  if (isLoading) {
    return null;
  }
  return (
    <div className={className}>
      <Helmet>
        <meta
          data-n-head="ssr"
          name="description"
          content="Ultimate platform for celebrities, influencers, creators and stars!"
        />
      </Helmet>
      <div id="wrapper" className="page-landing">
        <div className="loader wf-section">
          <div className="loader-wrapper">
            <img
              src="/assets/images/Musk-logo.svg"
              loading="lazy"
              alt=""
              className="logo-loader"
            />
            <div className="progress-bar-wrapper">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
        <nav className="wrappernav">
          <div
            data-collapse="medium"
            data-animation="default"
            data-duration="400"
            data-easing="ease"
            data-easing2="ease"
            role="banner"
            className="navbar w-nav"
          >
            <div className="w-layout-grid navgrid">
              <Link
                id="w-node-b2052354-5446-da9c-e906-f9d98118b8b1-8118b8ae"
                to="/signup"
                className="w-nav-brand"
              >
                <img
                  src="/assets/images/sp-logo.svg"
                  loading="lazy"
                  width="349"
                  height="91"
                  alt=""
                  className="image-brand"
                />
              </Link>
              <nav
                role="navigation"
                id="w-node-b2052354-5446-da9c-e906-f9d98118b8b3-8118b8ae"
                className="nav-menu w-nav-menu"
              >
                <div className="buttons-nav-wrapper">
                  <div className="w-layout-grid grid-buttons">
                    <Link
                      id="w-node-_17d6b7b8-e83a-c429-e128-8eb54f3dbb72-8118b8ae"
                      to="/login"
                      className="button topnav w-inline-block"
                    >
                      <div>Login</div>
                    </Link>
                    <div
                      onClick={() => {
                        history.push('/signup');
                      }}
                    >
                      <span className="button color-red topnav w-button">
                        Sign Up Free
                      </span>
                    </div>
                  </div>
                </div>
              </nav>
              <div
                className={`mobile-menu-opener ${
                  isMenuOpen ? 'landing-mobile-active' : ''
                }`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              ></div>
            </div>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="mobile-menu-block"
                key="right"
                custom={'right'}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants as any}
                style={{ width: '100%', position: 'absolute' }}
                transition={{ mass: 0.2, duration: 0.3 }}
              >
                <div className="mobile-links">
                  <Link
                    id="w-node-_17d6b7b8-e83a-c429-e128-8eb54f3dbb72-8118b8ae"
                    to="/login"
                    className="button topnav w-inline-block"
                  >
                    <div>Login</div>
                  </Link>
                  <div
                    onClick={() => {
                      history.push('/signup');
                    }}
                  >
                    <span className="button color-red topnav w-button">
                      Sign Up Free
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
        <div className="section wf-section">
          <div className="w-layout-grid hero-grid-header">
            <div
              id="w-node-_3a0f5fec-828a-eafa-5dce-f5c5693cd89f-16e0e5a2"
              className="wrap-container"
            >
              <div className="w-layout-grid main-grid">
                <div
                  id="w-node-ca850897-97af-cccd-0876-e55de8024ec1-16e0e5a2"
                  className="wrapper-container inner-padding-small"
                >
                  <div className="container header w-container">
                    <h1 className="heading-xlarge _16-ch">
                      Let your fans pay
                      <br />
                      <span className="text-span">to connect with you!</span>
                    </h1>
                    <div className="mt-10 w-layout-grid grid-buttons inner-padding-small">
                      <span
                        className="button color-red w-inline-block"
                        onClick={() => {
                          history.push('/signup');
                        }}
                      >
                        <div>Get Started</div>
                        <img
                          src="/assets/images/cta-arrow-white.svg"
                          loading="lazy"
                          alt=""
                          className="icon-arrow"
                        />
                      </span>
                      <Link
                        to="/login"
                        id="w-node-f978dd1c-8e89-3c5c-6a5a-012b8f08b031-16e0e5a2"
                        className="lightbox-link w-inline-block w-lightbox"
                      >
                        <div>Login</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="images-slider-wrap">
              <div className="images-slider-area">
                <div className="images-slider-frame">
                  <div
                    id="w-node-b3fdc0c4-7162-b493-f01a-ac52dffe4cd2-16e0e5a2"
                    className="hero-images-wrapper"
                  >
                    <Slider
                      className="slider-holder"
                      {...{
                        dots: true,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        autoplay: true,
                        speed: 5000,
                        arrows: false,
                        autoplaySpeed: 0,
                        cssEase: 'linear',
                        rtl: true,
                      }}
                    >
                      <img
                        src="/assets/images/Floaty-Pic1.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic1-p-500.jpeg 500w/, /assets/images/Floaty-Pic1.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d"
                      />
                      <img
                        src="/assets/images/Floaty-Pic8.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic8-p-500.jpeg 500w/, /assets/images/Floaty-Pic8.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic6.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic6-p-500.jpeg 500w/, /assets/images/Floaty-Pic6.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-flip"
                      />
                      <img
                        src="/assets/images/Floaty-Pic5.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic5-p-500.jpeg 500w/, /assets/images/Floaty-Pic5.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic9.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic12.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        alt=""
                        className="image-tiles-hero _3d"
                      />
                      <img
                        src="/assets/images/Floaty-Pic8.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic8-p-500.jpeg 500w/, /assets/images/Floaty-Pic8.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic2.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic2-p-500.jpeg 500w/, /assets/images/Floaty-Pic2.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-flip"
                      />
                      <img
                        src="/assets/images/Floaty-Pic4.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic4-p-500.jpeg 500w/, /assets/images/Floaty-Pic4.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic3.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic3-p-500.jpeg 500w/, /assets/images/Floaty-Pic3.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                    </Slider>
                    <Slider
                      className="slider-holder"
                      {...{
                        dots: true,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        autoplay: true,
                        speed: 5000,
                        arrows: false,
                        autoplaySpeed: 0,
                        cssEase: 'linear',
                        rtl: false,
                      }}
                    >
                      <img
                        src="/assets/images/Floaty-Pic2.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic2-p-500.jpeg 500w/, /assets/images/Floaty-Pic2.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic4.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic4-p-500.jpeg 500w/, /assets/images/Floaty-Pic4.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d"
                      />
                      <img
                        src="/assets/images/Floaty-Pic7.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic7-p-500.jpeg 500w/, /assets/images/Floaty-Pic7.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-flip"
                      />
                      <img
                        src="/assets/images/Floaty-Pic3.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic3-p-500.jpeg 500w/, /assets/images/Floaty-Pic3.jpg 800w"
                        alt=""
                        className="image-tiles-hero"
                      />
                      <img
                        src="/assets/images/Floaty-Pic10.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic5.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic5-p-500.jpeg 500w/, /assets/images/Floaty-Pic5.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                      <img
                        src="/assets/images/Floaty-Pic11.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic11-p-500.jpeg 500w/, /assets/images/Floaty-Pic11.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d"
                      />
                      <img
                        src="/assets/images/Floaty-Pic12.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        alt=""
                        className="image-tiles-hero _3d-flip"
                      />
                      <img
                        src="/assets/images/Floaty-Pic13.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic13-p-500.jpeg 500w/, /assets/images/Floaty-Pic13.jpg 800w"
                        alt=""
                        className="image-tiles-hero"
                      />
                      <img
                        src="/assets/images/Floaty-Pic8.jpg"
                        sizes="(max-width: 479px) 25vw, (max-width: 991px) 35vw, 25vw"
                        srcSet="/assets/images/Floaty-Pic8-p-500.jpeg 500w/, /assets/images/Floaty-Pic8.jpg 800w"
                        alt=""
                        className="image-tiles-hero _3d-reverse"
                      />
                    </Slider>
                  </div>
                  <div
                    id="w-node-d68f6320-2373-2433-0132-2ed5f3b9de3d-16e0e5a2"
                    className="device-wrapper"
                  >
                    <div className="video-holder">
                      <img
                        src="/assets/images/mobile-frame2.png"
                        loading="lazy"
                        alt=""
                        className="image-iphone"
                      />
                      <div className="video-box">
                        <video
                          className="bg-video"
                          width="640"
                          height="360"
                          loop
                          autoPlay
                          muted
                          playsInline
                          poster="https://d3ld2j1cb62bzw.cloudfront.net/thumb-pops/order-videos/751d48f8-16eb-45da-ac26-3e4e0d34af50-00001.png"
                        >
                          <source
                            type="video/mp4"
                            src="https://dzsg29m8tb5o8.cloudfront.net/vid-pops/order-videos/751d48f8-16eb-45da-ac26-3e4e0d34af50.mp4"
                          />
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section wf-section">
          <div className="container inner-padding-medium w-container">
            <div className="heading-wrapper-center margin-bottom-small">
              <div className="wrapper-black">
                <h2 className="text-white heading-medium">
                  All of your most important links in one place !
                </h2>
              </div>
            </div>
            <div className="w-layout-grid main-grid inner-padding-small">
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c891b-16e0e5a2"
                data-w-id="87feeca3-e733-f365-dfb5-9314443c891b"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/facebook.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c891d-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/twitter.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c891f-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/tiktok.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c8921-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/snapchat.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c8923-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/telegram.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c8925-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/flickr.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c8927-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/youtube.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c8929-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/instagram.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c892b-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/soundcloud.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c892d-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/twitch.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c892f-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/linkedin.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
              <div
                id="w-node-_87feeca3-e733-f365-dfb5-9314443c8931-16e0e5a2"
                className="logos-wrapper"
              >
                <img
                  src="/assets/images/pinterest.png"
                  loading="lazy"
                  alt=""
                  className="image-logo"
                />
              </div>
            </div>
          </div>
          <div className="container w-container">
            <div className="heading-wrapper-center padding-bottom-medium">
              <div className="wrapper-black">
                <h2 className="text-white heading-large">
                  Your true fans are calling, and they{' '}
                  <span className="text-span-2">
                    want to pay you to answer!
                  </span>
                </h2>
              </div>
            </div>
            <div className="w-layout-grid main-grid margin-bottom-small">
              <div
                id="w-node-_08f34b3a-f37f-f9f9-4979-af36e0d3abb7-16e0e5a2"
                data-w-id="08f34b3a-f37f-f9f9-4979-af36e0d3abb7"
                className="gray-wrapper block-icons"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="icon-wrapper">
                    <img
                      src="/assets/images/payqa.svg"
                      loading="lazy"
                      width="100"
                      height="100"
                      alt=""
                      className="icon-content"
                    />
                  </div>
                  <div className="small-paragraph-wrapper">
                    <h3 className="heading-small">Paid Q &amp; A</h3>
                    <p className="p-small-size text-white-opacity">
                      Get paid to provide your expert advice in any format you
                      choose.
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="w-node-_08f34b3a-f37f-f9f9-4979-af36e0d3abbf-16e0e5a2"
                className="gray-wrapper block-icons"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="icon-wrapper">
                    <img
                      src="/assets/images/poplive.svg"
                      loading="lazy"
                      alt=""
                      className="icon-content"
                    />
                  </div>
                  <div className="small-paragraph-wrapper">
                    <h3 className="heading-small">Live Video Chat</h3>
                    <p className="p-small-size text-white-opacity">
                      Have one on one video hangouts with your superfans.
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="w-node-_08f34b3a-f37f-f9f9-4979-af36e0d3abc7-16e0e5a2"
                className="gray-wrapper block-icons"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="icon-wrapper">
                    <img
                      src="/assets/images/videopop.svg"
                      loading="lazy"
                      alt=""
                      className="icon-content"
                    />
                  </div>
                  <div className="small-paragraph-wrapper">
                    <h3 className="heading-small">Custom Videos</h3>
                    <p className="p-small-size text-white-opacity">
                      Custom video greetings for your fans and their loved ones.
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="w-node-_08f34b3a-f37f-f9f9-4979-af36e0d3abcf-16e0e5a2"
                className="gray-wrapper block-icons"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="icon-wrapper">
                    <img
                      src="/assets/images/shoutout.svg"
                      loading="lazy"
                      alt=""
                      className="icon-content"
                    />
                  </div>
                  <div
                    id="w-node-_08f34b3a-f37f-f9f9-4979-af36e0d3abd4-16e0e5a2"
                    className="small-paragraph-wrapper"
                  >
                    <h3 className="heading-small">Promotional Shoutouts</h3>
                    <p className="p-small-size text-white-opacity">
                      Promote other brands and on your social media channels.{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-w-id="42d63e69-4304-48a1-2bf3-aaa00065bd28"
            className="big-heading-wrapper"
          ></div>
          <div className="container w-container">
            <div className="w-layout-grid main-grid">
              <div
                id="w-node-_52c2fb1c-ed3c-7a2a-df9c-cbac8eb0be1c-16e0e5a2"
                className="rounded image-grid-wrapper"
              >
                <img
                  src="/assets/images/Jackson-Promo.jpg"
                  loading="lazy"
                  width="800"
                  height="830"
                  srcSet="/assets/images/Jackson-Promo-p-500.jpeg 500w/, /assets/images/Jackson-Promo.jpg 707w"
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 707px, (max-width: 768px) 92vw, 94vw"
                  alt=""
                  className="full-image"
                />
              </div>
              <div
                id="w-node-_7c8b8188-802f-ede8-9322-2da997cd6e10-16e0e5a2"
                className="grid-wrapper"
              >
                <div className="paragraph-wrapper margin-bottom-xsmall">
                  <h3 className="heading-xlarge">Your Fans, Your Way</h3>
                  <p className="main-paragraph bold">
                    Give your fans fun, new ways to connect directly with you.
                    They can pay to ask you questions, order video shoutouts and
                    see all of the links that matter to your brand on a single,
                    elegant page.
                  </p>
                  <span
                    onClick={() => {
                      history.push('/signup');
                    }}
                    className="link-wrapper inner-padding-micro w-inline-block"
                  >
                    <div>Get started</div>
                    <img
                      src="/assets/images/cta-arrow-white.svg"
                      loading="lazy"
                      alt=""
                      className="icon-arrow"
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="w-layout-grid main-grid">
              <div
                id="w-node-ba4b7641-5d15-1fed-1142-68d184c430d4-16e0e5a2"
                className="rounded image-grid-wrapper"
              >
                <img
                  src="/assets/images/Earn-it.jpg"
                  loading="lazy"
                  width="800"
                  height="830"
                  srcSet="/assets/images/Earn-it-p-500.jpeg 500w/, /assets/images/Earn-it.jpg 800w"
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 92vw, 94vw"
                  alt=""
                  className="full-image"
                />
              </div>
              <div
                id="w-node-ba4b7641-5d15-1fed-1142-68d184c430d6-16e0e5a2"
                className="grid-wrapper"
              >
                <div className="paragraph-wrapper margin-bottom-xsmall">
                  <h3 className="heading-xlarge">Create.</h3>
                  <p className="main-paragraph bold">
                    With your Selfie Pop Fan Page, you can build deeper
                    connections with your fans and{' '}
                    <span className="text-span-3">get paid</span> to do it.
                    Responding to the messages or filming your shoutouts can
                    take{' '}
                    <span className="text-span-4">as little as 30 seconds</span>{' '}
                    to complete and can be offered at whatever price works for
                    you.
                  </p>
                  <span
                    onClick={() => {
                      history.push('/signup');
                    }}
                    className="link-wrapper inner-padding-micro w-inline-block"
                  >
                    <div>Start here</div>
                    <img
                      src="/assets/images/cta-arrow-white.svg"
                      loading="lazy"
                      alt=""
                      className="icon-arrow"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="container w-container">
            <div className="mb-0 w-layout-grid main-grid">
              <div
                id="w-node-_437558d3-8632-0fbd-a308-c693fe286b88-16e0e5a2"
                className="gray-wrapper float-bottom"
                style={{ background: '#e51075' }}
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div
                    id="w-node-ef93fe5d-34c7-3c78-f839-6bbfda572347-16e0e5a2"
                    className="paragraph-wrapper align-center"
                  >
                    <h2 className="mb-20 heading-xlarge">
                      Your Pop Page is all about You!
                    </h2>
                    <p className="main-paragraph small-width">
                      This is not a marketplace, but rather your own private
                      platform. This way you can directly link from your social
                      media without sharing your audience or diluting your
                      brand.
                    </p>
                  </div>
                  <div
                    id="w-node-f1c6e4f9-a895-85a7-a4ab-7bbe061b7e6a-16e0e5a2"
                    className="images-features-wrapper"
                  >
                    <img
                      src="/assets/images/all-about-you.jpg"
                      loading="lazy"
                      height=""
                      alt=""
                      className="image-features max-width"
                    />
                  </div>
                </div>
              </div>
              <div
                id="w-node-_08d33862-878c-8277-22a8-f994ce27c920-16e0e5a2"
                className="gray-wrapper float-bottom"
                style={{ background: '#6411ff' }}
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="paragraph-wrapper margin-bottom-small">
                    <h3 className="heading-regular">
                      You can also use your page to sell promotional shoutouts
                      to other brands and influencers!
                    </h3>
                    <p className="main-paragraph">
                      Easily sell and deliver promotional shoutouts on your
                      various social media channels to other brands and
                      influencers.
                    </p>
                  </div>
                  <div
                    id="w-node-_70b92a9f-b7c6-8770-e5d3-a6c4007ae156-16e0e5a2"
                    className="images-features-wrapper"
                  >
                    <img
                      src="/assets/images/shoutouts-are-fun.jpg"
                      loading="lazy"
                      alt=""
                      className="image-features"
                    />
                  </div>
                </div>
              </div>
              <div
                id="w-node-_0609013d-5310-d81d-dad0-4e6150d692d9-16e0e5a2"
                className="gray-wrapper float-bottom"
                style={{ background: '#333' }}
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="paragraph-wrapper margin-bottom-small">
                    <h3 className="heading-regular">
                      In just 30 seconds, you can create a loyal fan for life!
                    </h3>
                    <p className="main-paragraph">
                      With your Selfie Pop Fan Page, you can build deeper
                      connections with your fans and get paid to do it.
                    </p>
                  </div>
                  <div
                    id="w-node-_0609013d-5310-d81d-dad0-4e6150d692e0-16e0e5a2"
                    className="images-features-wrapper"
                  >
                    <img
                      src="/assets/images/deeper-connections.jpg"
                      loading="lazy"
                      alt=""
                      className="image-features"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container inner-padding-medium w-container">
            <div className="heading-wrapper-center padding-bottom-medium">
              <h2 className="heading-large">Transparent pricing for you</h2>
            </div>
            <div className="w-layout-grid main-grid">
              <div
                id="w-node-_9be61596-31db-181e-93a6-c3359bddcd2a-9bddcd29"
                className="gray-wrapper pricing"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="price-wrapper margin-bottom-xsmall">
                    <h3 className="heading-small text-light">Solo</h3>
                    <p className="price">$9</p>
                  </div>
                  <div className="list-wrapper">
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>1,000 Members</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>10 spaces</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Custom domain</div>
                    </div>
                    <div className="list-flex off">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="list-flex off">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="list-flex off">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="button-plan-wrapper">
                      <a href="#" className="button w-inline-block">
                        <div>Get Started</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="w-node-ec02ac35-d092-ad36-a689-3ff8f890d4ca-9bddcd29"
                className="gray-wrapper pricing"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="price-wrapper margin-bottom-xsmall">
                    <h3 className="heading-small text-light">Freelancer</h3>
                    <p className="price">$19</p>
                  </div>
                  <div className="list-wrapper">
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>1,000 Members</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>10 spaces</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Custom domain</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="list-flex off">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="list-flex off">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="button-plan-wrapper">
                      <a href="#" className="button w-inline-block">
                        <div>Get Started</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="w-node-d107247b-122e-9c98-30e6-61253f698065-9bddcd29"
                className="gray-wrapper selected-plan pricing"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="price-wrapper margin-bottom-xsmall">
                    <h3 className="heading-small text-light">Startup</h3>
                    <p className="price">$29</p>
                  </div>
                  <div className="list-wrapper">
                    <div className="text-white list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>1,000 Members</div>
                    </div>
                    <div className="text-white list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>10 spaces</div>
                    </div>
                    <div className="text-white list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Custom domain</div>
                    </div>
                    <div className="text-white list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="text-white list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="text-white list-flex off">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="button-plan-wrapper">
                      <a href="#" className="button color-red w-inline-block">
                        <div>Get Started</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="w-node-a82b213a-e40d-f951-4522-7d28fb1873e7-9bddcd29"
                className="gray-wrapper pricing"
              >
                <div className="w-layout-grid content-grid gap-short">
                  <div className="price-wrapper margin-bottom-xsmall">
                    <h3 className="heading-small text-light">Agency</h3>
                    <p className="price">$69</p>
                  </div>
                  <div className="list-wrapper">
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>1,000 Members</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>10 spaces</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Custom domain</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="list-flex">
                      <div className="circle-check">
                        <img
                          src="/assets/images/icon-check.svg"
                          loading="lazy"
                          alt=""
                          className="icon-check"
                        />
                      </div>
                      <div>Zapier integration</div>
                    </div>
                    <div className="button-plan-wrapper">
                      <a href="#" className="button w-inline-block">
                        <div
                          onClick={() => {
                            history.push('/signup');
                          }}
                        >
                          Get Started
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SignupSection signupRef={signupRef} />
        <footer className="section wf-section">
          <div className="container footer w-container">
            <div className="w-layout-grid inner-padding-small">
              <div className="main-grid">
                <div className="copyright-area">
                  <img
                    src="/assets/images/sp-logo.svg"
                    loading="lazy"
                    width="150"
                    height="150"
                    alt=""
                    className="logo-footer"
                  />
                  <p className="main-paragraph">
                    Create a free Selfie Pop page today!
                  </p>
                </div>
                <div className="links-area">
                  <ul className="footer-links">
                    <li>
                      <Link to="/terms">Terms</Link>
                    </li>
                    <li>
                      <Link to="/policy">Privacy</Link>
                    </li>
                    <li>
                      &copy; {dayjs().format('YYYY')} <a href="#">Selfiepop</a>{' '}
                      Inc.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default styled(Home)`
  .rail-wrapper-reverse {
    -webkit-transform: translate3d(-100%, 0, 0) scale3d(1, 1, 1) rotateX(0)
      rotateY(0) rotateZ(0) skew(0, 0);
    -moz-transform: translate3d(-100%, 0, 0) scale3d(1, 1, 1) rotateX(0)
      rotateY(0) rotateZ(0) skew(0, 0);
    -ms-transform: translate3d(-100%, 0, 0) scale3d(1, 1, 1) rotateX(0)
      rotateY(0) rotateZ(0) skew(0, 0);
    transform: translate3d(-100%, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0)
      rotateZ(0) skew(0, 0);
  }
  .w-commerce-commercecartapplepaybutton {
    background-image: -webkit-named-image(apple-pay-logo-white);
    background-size: 100% 50%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }
  .slider-holder {
    margin-bottom: 2vw;
    .slick-slide {
      padding: 0 1vw;
    }
  }
  .mobile-menu-opener {
    width: 30px;
    height: 20px;
    border-top: 2px solid #fff;
    position: absolute;
    right: 20px;
    top: 30px;
    transition: all 0.4s ease;
    cursor: pointer;
    &.landing-mobile-active {
      border-top: none;
      &:after,
      &:before {
        top: 10px;
        transform: rotate(45deg);
      }
      &:after {
        transform: rotate(-45deg);
      }
    }
    &:after,
    &:before {
      position: absolute;
      left: 0;
      right: 0;
      top: 6px;
      content: '';
      height: 2px;
      background: var(--pallete-background-default);
      transition: all 0.4s ease;
    }
    &:after {
      top: 14px;
    }
    @media (min-width: 992px) {
      display: none;
    }
  }
  .mobile-menu-block {
    left: 0;
    right: 0;
    background: #000;
    top: 100%;
    @media (min-width: 992px) {
      display: none;
    }
    .mobile-links {
      padding: 20px;
    }
    .button {
      width: 150px;
      margin: 0 auto 15px;
      justify-content: center !important;
    }
  }
  .slick-dots {
    display: none !important;
  }
  .page-landing {
    .navgrid {
      min-height: 80px;
    }
    .hero-grid-header {
      display: block;
      .main-grid {
        margin-top: 0;
        margin-bottom: 0;
      }
    }
    .wrap-container {
      margin: 0 auto;
    }
    .hero-images-wrapper {
      padding: 30px 0;
    }
    .wrappernav {
      position: relative;
    }
    .form {
      align-items: flex-start;
      .w-button {
        height: 65px;
      }
      .text-field {
        margin: 0;
        width: 100%;
      }
    }
    .images-slider-wrap {
      position: relative;
      min-height: 1075px;
      display: flex;
      margin: 0 0 45px;
      @media (max-width: 1199px) {
        min-height: 830px;
      }
      @media (max-width: 991px) {
        min-height: 520px;
        margin: 0 0 20px;
      }
      .images-slider-area {
        display: flex;
        min-height: inherit;
        align-items: center;
        width: 100%;
      }
      .images-slider-frame {
        width: 100%;
      }
      .device-wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .video-holder {
        margin: 0;
      }
    }
    .icon-content {
      width: 70px;
      max-width: inherit;
      max-height: inherit;
      height: auto;
      @media (max-width: 1199px) {
        width: 50px;
      }
    }
    .footer {
      .main-grid {
        margin: 0;
      }
      .main-paragraph {
        @media (max-width: 991px) {
          font-size: 1.1em;
        }
      }
    }
  }
  .field-holder {
    position: relative;
    margin: 0 15px 10px 0;
    @media (max-width: 1199px) {
      width: calc(33.33% - 16px);
      margin: 0 8px 10px;
    }
    @media (max-width: 767px) {
      width: 100%;
      margin: 0 0 10px;
    }
    .error-state {
      text-align: left;
      display: block;
      padding: 5px 0 0;
      color: #fff;
    }
  }
  .submit-holder {
    position: relative;
    @media (max-width: 767px) {
      width: 100%;
    }
    svg {
      position: absolute;
      left: 10px;
      width: 18px;
      height: 18px;
      top: 50%;
      transform: translate(0, -50%);
      @media (max-width: 767px) {
        left: 20px;
      }
    }
  }
  .container.footer {
    padding-top: 0 !important;
  }
  .small-width {
    max-width: 678px;
    margin: 0 auto;
  }
  .heading-form {
    font-size: 52px;
    line-height: 1.1;
    margin-top: 0;
    @media (max-width: 767px) {
      font-size: 30px;
      margin-top: 30px;
    }
  }
  .footer-links {
    color: #a5a5a5;
    li {
      @media (max-width: 767px) {
        padding: 0 5px 10px;
      }
    }
  }
  .paragraph-wrapper {
    p {
      color: rgba(255, 255, 255, 0.9);
    }
  }
`;
