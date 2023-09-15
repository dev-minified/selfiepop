import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';
import { ChevronRight } from 'assets/svgs';
import ApplyThemeModal from 'components/ApplyThemeModal';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import Footer from 'components/partials/footer';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isBrowser, isMobileOnly } from 'react-device-detect';
import { Helmet } from 'react-helmet';
import { matchPath } from 'react-router';
import { Link, useHistory, useParams } from 'react-router-dom';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import { resetPurchaseHeader } from 'store/reducer/headerState';
import { setCurrentTheme } from 'store/reducer/theme';
import styled, { DefaultTheme, ThemeProvider, css } from 'styled-components';
import { getCSSFontURL, getChangeUrlsOnly } from 'util/index';
import { ImageLayoutOptions } from '../enums';
import Logo from '../theme/logo';
import BackgroundColor from './component/BackgroundColor';
import BackgroundImageComp from './component/BackgroundImage';
import BackgroundVideo from './component/BackgroundVideo';
import PublicHeader from './component/public-header';

const PublicLayoutStyle = styled.div<{ theme: ITheme; applyTheme: boolean }>`
  ${(props) =>
    props.applyTheme &&
    css`
      font-family: '${props?.theme?.font?.family}',
        ${props.theme?.font?.category};
    `}
`;

const StyledBackgroundImage = styled.div<{
  twoPanelLayout?: boolean;
  theme: ITheme;
}>`
  position: absolute;
  // z-index: -1;
  .top-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  ${({ theme }) => {
    if (theme?.background?.image) {
      switch (theme?.background?.layout) {
        case ImageLayoutOptions.MIDDLE:
          return `
          bottom: auto;
          right: auto;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);

          img {
            width: auto;
            height: auto;
            max-width: inherit;
          }
          `;
        case ImageLayoutOptions.TOP:
          return `
          bottom: auto;
          right: auto;
          width: auto;
          height: auto;
          left: 50%;
          transform: translate(-50%, 0);

          img {
            width: auto;
            height: auto;
            max-width: inherit;
          }
        `;
        case ImageLayoutOptions.BOTTOM:
          return `
          top: auto;
          right: auto;
          width: auto;
          height: auto;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 0);

          img {
            width: auto;
            height: auto;
            max-width: inherit;
          }
        `;
        case ImageLayoutOptions.TOP_COVER:
          return `
          bottom: auto;
          top: 0;
          left:0;
          right:0;`;
        case ImageLayoutOptions.BOTTOM_COVER:
          return `
          top: auto;
          bottom: 0;
          left:0;
          right:0;`;
        case ImageLayoutOptions.MIDDLE_COVER:
          return `
          top: 50%;
          left:0;
          right:0;
          bottom: auto;
          transform: translate(0, -50%);`;
        case ImageLayoutOptions.TITLE:
          return `
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
            img{
              display:none;
            }

          `;
        default:
          return css`
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            ${({ twoPanelLayout }: any) =>
              twoPanelLayout ? ' left: 420px;' : ' left: 0;'}
          `;
      }
    }
    return 'display:none';
  }}
`;

export const defaultTheme: DefaultTheme = {
  button: { style: 'outline', buttonColor: 'blue' },
  cover: { size: 'full', isActive: true },
  profile: {
    style: 'outline-hard-shadow-hard-square',
    size: 'default',
    isActive: true,
  },
};

const TopNotification: React.FC<{
  open: boolean;
  user: any;
  onClose: () => void;
}> = ({ open, user, onClose }) => {
  const history = useHistory();

  return open ? (
    <div>
      <div className={`notification-bar info bordered`}>
        <div
          className={`d-flex justify-content-center justify-content-md-between align-items-center flex-wrap flex-md-nowrap`}
        >
          <div className="text-center notification-bar__left-box text-md-left">
            <span className="notification-bar__title">
              <div className="icon icon-close" onClick={onClose}></div>
            </span>
            You are viewing your Pop Page.{' '}
            <span className="theme-name-info">
              <span className="theme-text">Theme: </span>{' '}
              {user?.userThemeId?.name}
            </span>
          </div>
          <div
            onClick={() => {
              history.push('/my-profile');
            }}
            className="btn-bar"
          >
            EDIT MY POP PAGE
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const PurchaseHeader = styled.header`
  background: #000;
  color: #fff;
  margin-bottom: 50px;
  padding: 15px 0;

  .button {
    color: #fff;
    min-width: inherit;
    padding: 0 0 0 10px;

    svg {
      transform: rotate(180deg);
      margin: 0 20px 0 0;
    }
  }

  .user-name-container {
    cursor: pointer;
    display: none;
  }

  .user-name {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px 0 0;
    font-size: 18px;
    line-height: 22px;
  }

  .user-img {
    width: 44px;
    height: 44px;
    border-radius: 100%;
    position: relative;
    overflow: hidden;
    margin: 0 0 0 10px;
    display: inline-block;
    vertical-align: middle;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const PublicLayout: React.FC<any> = ({
  children,
  showFooter = true,
  layoutProps = {},
  enableTheme = false,
  hideTopFooter,
  isApplyModalOpen,
  setIsApplyModalOpen,
  onRevertTheme,
  onApplyTheme,
  isThemeApplying,
  selectedTheme,
  isRightSide = false,
  isPreview = false,
  ...props
}: any) => {
  const { showHeader = true } = layoutProps;
  const [gaInitialized, setGaInitialized] = useState(false);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { username } = useParams<any>();
  const [topNotificationOpen, setTopNotificationOpen] =
    useState<boolean>(false);
  const publicUser = useAppSelector((state) => state.global?.publicUser);
  const order = useAppSelector((state) => state.checkout?.order);
  const purchaseHeaderUrl = useAppSelector(
    (state) => state.header.purchaseBackUrl,
  );
  const isPurchaseHeader = useAppSelector(
    (state) => state.header.isPurchaseHeader,
  );
  const { user: loggedUser } = useAuth();

  const publicUserGoogleAnalytics = useMemo(
    () =>
      publicUser?.gaTrackers?.find(
        (ga: { id: string; isActive: boolean }) =>
          ga.isActive && ga.id?.startsWith('G-'),
      ),
    [publicUser?._id],
  );
  const googleAnalyticRef = useRef<any>();
  const match = matchPath(history.location.pathname, {
    path: '/:username',
    exact: true,
    strict: false,
  });
  // const backLinks = [ServiceType.CHAT_SUBSCRIPTION];
  const backLinks: string[] = [];

  const purchaseMatch = matchPath(history.location.pathname, {
    path: '/:username/purchase',
    exact: false,
  });

  const congratulationsMatch = matchPath(history.location.pathname, {
    path: '/:username/purchase/congratulations',
    exact: true,
  });

  const themePreviewMatch = matchPath(history.location.pathname, {
    path: '/theme-library/preview',
    exact: true,
  });

  const popslugMatch = matchPath(history.location.pathname, {
    path: '/:username/:popslug',
    exact: true,
  });
  const applyFullTheme: boolean = enableTheme || match; /* || popslugSubMatch */

  const applyModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      match &&
      !props.twoPanelLayout &&
      publicUser &&
      loggedUser &&
      publicUser?._id === loggedUser?._id
    ) {
      setTopNotificationOpen(true);
    } else {
      setTopNotificationOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.path, publicUser, loggedUser]);

  // User Added Analytics
  useEffect(() => {
    if (!isPreview && publicUserGoogleAnalytics) {
      googleAnalyticRef.current = Analytics({
        app: 'user-custom',
        plugins: [
          googleAnalytics({
            measurementIds: [publicUserGoogleAnalytics.id],
          }),
        ],
      });
      setGaInitialized(true);
    }
  }, [publicUserGoogleAnalytics]);

  useEffect(() => {
    if (googleAnalyticRef.current && !isPreview && gaInitialized) {
      googleAnalyticRef.current.page({
        url: history.location.pathname + history.location.search,
      });
    }
  }, [gaInitialized, history.location]);
  //End: user Added Analytics

  useLayoutEffect(() => {
    dispatch(resetPurchaseHeader());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return () => {
      if (isMobileOnly && props.twoPanelLayout) {
        dispatch(setCurrentTheme(undefined));
      }
      setIsApplyModalOpen?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const scrollApplyModalIntoView = () => {
    if (applyModalRef.current) {
      scrollIntoView(applyModalRef.current, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
        block: 'start',
      });
    }
  };
  useEffect(() => {
    if (props.isOnboarding || isApplyModalOpen) {
      setTimeout(() => {
        scrollApplyModalIntoView();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApplyModalOpen, selectedTheme]);

  const purchase =
    !props.twoPanelLayout &&
    !congratulationsMatch &&
    !themePreviewMatch &&
    (purchaseMatch || popslugMatch) &&
    isPurchaseHeader;
  const link =
    `https://${window.location.host}/${props.user?.username}`.replace(
      'www.',
      '',
    );
  const { url: profileImageUrl } = getChangeUrlsOnly(props?.user?.profileImage);
  return (
    <div>
      {props.theme?.font && applyFullTheme && (
        <Helmet>
          <link href={getCSSFontURL(props.theme?.font)} rel="stylesheet" />
        </Helmet>
      )}
      <Helmet>
        <title>
          {username ? props.user?.username || 'SelfiePop' : 'SelfiePop'}
        </title>
        {/* Facebook Meta Tags */}
        <meta
          data-n-head="ssr"
          name="description"
          content={`${props?.user?.username} | ${
            props?.user?.description ??
            `Connect with ${props?.user?.username} on Selfiepop.com`
          }`}
        />
        <meta
          data-n-head="ssr"
          name="keywords"
          content="SelfiePop, public profile,"
        />
        <meta data-n-head="ssr" property="og:url" content={link} />
        <meta data-n-head="ssr" property="og:type" content="website" />
        <meta
          data-n-head="ssr"
          property="og:title"
          content={props.user?.username || 'SelfiePop'}
        />
        <meta
          data-n-head="ssr"
          property="og:description"
          content={`${props?.user?.username} | ${
            props?.user?.description ??
            `Connect with ${props?.user?.username} on Selfiepop.com`
          }`}
        />
        <meta data-n-head="ssr" property="og:image" content={profileImageUrl} />
        <meta data-n-head="ssr" property="og:site_name" content="SelfiePop" />
        <meta
          data-n-head="ssr"
          property="og:description"
          content={`${props?.user?.username} | ${
            props?.user?.description ??
            `Connect with ${props?.user?.username} on Selfiepop.com`
          }`}
        />
        {/* Twitter */}
        <meta data-n-head="ssr" name="twitter:card" content="SelfiePop" />
        <meta data-n-head="ssr" property="twitter:domain" content="" />
        <meta data-n-head="ssr" property="twitter:url" content={link} />
        <meta
          data-n-head="ssr"
          name="twitter:title"
          content={props.user?.username || 'SelfiePop'}
        />
        <meta
          data-n-head="ssr"
          name="twitter:description"
          content={`${props?.user?.username} | ${
            props?.user?.description ??
            `Connect with ${props?.user?.username} on Selfiepop.com`
          }`}
        />
        <meta
          data-n-head="ssr"
          name="twitter:image"
          content={props?.user?.profileImage}
        />
      </Helmet>
      <TopNotification
        open={topNotificationOpen}
        user={props.user}
        onClose={() => setTopNotificationOpen(false)}
      />
      {(props.isOnboarding && isMobileOnly && isApplyModalOpen) ||
      (!props.isOnboarding && isApplyModalOpen) ? (
        <ApplyThemeModal
          modalRef={applyModalRef}
          selectedTheme={selectedTheme}
          isThemeApplying={isThemeApplying}
          onRevertTheme={onRevertTheme}
          onApplyTheme={onApplyTheme}
        />
      ) : null}
      <div
        id="public-layout"
        style={{
          position: 'relative',
          zIndex: 0,
        }}
      >
        <ThemeProvider theme={props.theme || defaultTheme}>
          <PublicLayoutStyle applyTheme={applyFullTheme}>
            <div
              id="wrapper"
              className="d-flex flex-column min-vh-100 position-relative"
              style={{ zIndex: 0, overflow: 'hidden' }}
            >
              {/* start Background color*/}
              <AnimatePresence>
                {applyFullTheme && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* {props.theme?.background?.type === 'color' && (
                      <BackgroundColor
                        twoPanelLayout={isBrowser && props.twoPanelLayout}
                      />
                    )} */}
                    <BackgroundColor
                      twoPanelLayout={isBrowser && props.twoPanelLayout}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* End Background color*/}

              {/* start Background image*/}
              <AnimatePresence>
                {applyFullTheme && (
                  <motion.div
                    className="bg-holder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {props.theme?.background?.image &&
                      (props.theme?.background?.type === 'image' ||
                        props.theme?.background?.type === 'video') && (
                        <StyledBackgroundImage
                          twoPanelLayout={isBrowser && props.twoPanelLayout}
                        >
                          <div className="top-overlay"></div>
                          {/* <BackgroundImage
                          src={bgImage}
                          fallbackUrl={props.theme?.background?.image}
                        /> */}
                          <BackgroundImageComp />
                        </StyledBackgroundImage>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* End Background image*/}

              {/* start Background video*/}
              <AnimatePresence>
                {applyFullTheme && (
                  <motion.div
                    className="video-holder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <BackgroundVideo />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* End Background video*/}

              {purchase && showHeader ? (
                <PurchaseHeader className="purchase-header">
                  <div className="container-fluid d-flex align-items-center justify-content-between">
                    <Button
                      onClick={() => {
                        const backUrl = purchaseHeaderUrl
                          ? purchaseHeaderUrl
                          : purchaseMatch &&
                            !backLinks.includes(order?.popId?.popType)
                          ? `/${props.user?.username}/${order?.popId?.popName}`
                          : `/${props.user?.username}`;

                        history.push(backUrl);
                      }}
                      icon={<ChevronRight />}
                      type="text"
                    >
                      Back
                    </Button>
                    <div
                      className="user-name-container"
                      onClick={() => history.push(`/${props.user?.username}`)}
                    >
                      <span className="user-name">
                        {`${props?.user?.pageTitle ?? 'Incognito User'}`}
                      </span>
                      <span
                        className="user-img"
                        style={{
                          background: 'var(--pallete-primary-main)',
                        }}
                      >
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                          }}
                        >
                          <ImageModifications
                            src={props?.user?.profileImage}
                            fallbackUrl={
                              '/assets/images/default-profile-pic.png'
                            }
                            imgeSizesProps={{
                              onlyMobile: true,

                              imgix: { all: 'w=163&h=163' },
                            }}
                            alt="img description"
                          />
                        </div>
                      </span>
                    </div>
                  </div>
                </PurchaseHeader>
              ) : !applyFullTheme ? (
                <div className={`${isRightSide ? 'mb-40' : 'mb-100'}`} />
              ) : (
                <PublicHeader
                  theme={props.theme}
                  applyFullTheme={applyFullTheme}
                  user={props.user}
                />
              )}
              {/* {
  : props.theme?.profile?.profileVideo?.active ? (
                <ProfileVideoHeader
                  theme={props.theme}
                  applyFullTheme={applyFullTheme}
                  user={props.user}
                  // uncertain class for public video header
                  className="mt-40"
                />
              )
} */}
              <main id="main" className="flex-grow-1">
                <div
                  className={`container sm-container mb-80 ${
                    isRightSide ? 'rightPreview' : ''
                  }`}
                >
                  <React.Suspense fallback={<div>Loading...</div>}>
                    {React.Children.toArray(children).map((child) => {
                      return React.cloneElement(child as any, {
                        user: props.user,
                        isPreview,
                        ...props,
                      });
                    })}
                  </React.Suspense>
                </div>
              </main>
              {showFooter ? (
                purchase ? (
                  <Footer hideTopFooter={hideTopFooter || !match} />
                ) : (
                  <Link to="/" className="public-logo">
                    {/* <OutlinedLogo color={props.theme?.additional?.titleColor} /> */}
                    <Logo />
                  </Link>
                )
              ) : null}
            </div>
          </PublicLayoutStyle>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default PublicLayout;
