import classNames from 'classnames';
import LeftSideBarSubHeader from 'components/partials/LeftSideBarSubHeader';
import RightSideBarSubHeader from 'components/partials/RightSideBarSubHeader';
import EditBack from 'components/partials/components/profileBack';
import { AnimatePresence, Variants } from 'framer-motion';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import React, { ReactElement, useEffect, useRef } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import styled, { CSSProperties } from 'styled-components';
import PageTransition from './page-transition';

const rtr = {
  pageInitial: {
    opacity: 0,
    left: '660px',
  },
  pageAnimate: {
    opacity: 1,
    left: '0',
  },
  pageExit: {
    opacity: 0,
    left: '660px',
    position: 'absolute',
  },
};
const ltl = {
  pageInitial: {
    opacity: 0,
    left: '-660px',
  },
  pageAnimate: {
    opacity: 1,
    left: '0',
  },
  pageExit: {
    opacity: 0,
    left: '-660px',
    position: 'absolute',
  },
};

interface Props {
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
  defaultRightSide?: boolean;
  classes?: { leftView?: string; rightView?: string; content?: string };
  styles?: { leftView?: CSSProperties; rightView?: CSSProperties };
  className?: string;
  children?: JSX.Element | JSX.Element[];
  defaultBackButton?: boolean;
  leftSubHeader?: boolean;
  rightSubHeader?: boolean;
  twopanelId?: string;
  LeftSidebar?: React.ReactNode;
  RightSidebar?: React.ReactNode;
  onDefaultBackclick?: () => void;
}
const LeftSideSubHeaderNotAllowed: any[] = [];
const RightSideSubHeaderNotAllowed = [
  '/my-purchases',
  '/my-sales',
  '/support',
  '/onboarding/theme-selection',
  '/onboarding/private-pop-setup',
  '/onboarding/set-password',
];
export const setTwoPanelLayoutHeight = () => {
  setTimeout(() => {
    const ele = document.getElementById('twopanellayout');
    const bottomnav = document.querySelector('.appmobileView .site_main_nav');
    if (bottomnav && ele) {
      const details = ele?.getBoundingClientRect();
      const bottomDetails = bottomnav?.getBoundingClientRect();
      console.log({ bottomDetails, details });
      ele.style.height = `calc(100vh - ${
        details?.top + bottomDetails.height
      }px)`;
      // ele?.setAttribute(
      //   'style',
      //   `
      //   height: calc(100vh - ${details?.top + bottomDetails.height}px)
      // `,
      // );
      // ele.style.overflow = 'scroll';
    } else {
      ele?.setAttribute(
        'style',
        `
        height: calc(100vh - ${ele?.getBoundingClientRect().y}px)
      `,
      );
    }
  }, 0);
};
let timeout: any;
export function Layout({
  leftView,
  rightView,
  classes = {},
  styles = {},
  className = '',
  children,
  twopanelId = 'twopanellayout',
  leftSubHeader = true,
  rightSubHeader = true,
  defaultBackButton = true,
  LeftSidebar = null,
  RightSidebar = null,
  onDefaultBackclick,
  ...rest
}: Props): ReactElement {
  const { user } = useAuth();
  const isNotificationBarClosed = useAppSelector(
    (state) => state.global.emailNotificationClosedByUser,
  );
  const { activeView, showLeftView } = useControllTwopanelLayoutView();
  const location = useLocation();
  useEffect(() => {
    showLeftView();
  }, [location.pathname, showLeftView]);

  const rendering = useRef(true);
  const rightScrollbarRef = useRef<any>(null);
  const leftSCrollbarRef = useRef<any>(null);
  const leftPanelRef = useRef<any>(null);
  const rightPanelRef = useRef<any>(null);

  const {
    leftView: leftViewClass,
    rightView: rigthViewClass,
    content: contentClass,
  } = classes;
  const { leftView: leftViewStyle, rightView: rigthViewStyle } = styles;

  const theme = useAppSelector((state) => state.theme?.current);

  const Childrens = React.Children.toArray(children);
  let LeftPanelView = leftView;
  let RightPanelView = rightView;

  if (Childrens.length === 2) {
    LeftPanelView = Childrens[0];
    RightPanelView = Childrens[1];
  }
  useEffect(() => {
    clearTimeout(timeout);
    if (rightScrollbarRef?.current || leftSCrollbarRef?.current)
      timeout = setTimeout(() => {
        rightScrollbarRef?.current?.forceUpdate();
        leftSCrollbarRef?.current?.forceUpdate();
      }, 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.pathname,
    rightScrollbarRef?.current,
    leftSCrollbarRef?.current,
  ]);
  useEffect(() => {
    showLeftView();
    rendering.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setTwoPanelLayoutHeight();
  }, [isNotificationBarClosed]);

  const onleftscrollposition = async (time = 0) => {
    if (leftSCrollbarRef.current) {
      setTimeout(() => {
        leftSCrollbarRef?.current?.scrollToTop();
      }, time);
    }
  };
  const onrightscrollposition = async (time = 0) => {
    if (rightScrollbarRef.current) {
      setTimeout(() => {
        rightScrollbarRef?.current?.scrollToTop();
      }, time);
    }
  };

  let LSideBar = null;
  if (LeftSidebar) {
    LSideBar = LeftSidebar;
  } else {
    const isSidebar =
      !LeftSideSubHeaderNotAllowed.includes(location.pathname) && leftSubHeader;
    LSideBar = isSidebar ? <LeftSideBarSubHeader /> : null;
  }
  let RSideBar = null;
  if (RightSidebar) {
    RSideBar = RightSidebar;
  } else {
    const isSidebar =
      !RightSideSubHeaderNotAllowed.includes(location.pathname) &&
      rightSubHeader;
    RSideBar = isSidebar ? <RightSideBarSubHeader user={user} /> : null;
  }

  return (
    <div className={classNames(className)}>
      <div id={twopanelId}>
        <BrowserView
          className={classNames('desktop_view', 'two--panel-layout')}
          style={{ height: '100%' }}
        >
          <div
            className={classNames('col-left', leftViewClass)}
            style={{ position: 'relative', zIndex: 1, ...leftViewStyle }}
          >
            {LSideBar}

            <div className={classNames('col-inner-content', contentClass)}>
              {React.cloneElement(LeftPanelView as any, {
                ...rest,
                scrollref: leftSCrollbarRef,
                user,
                theme: theme || user.userThemeId,
              })}
            </div>
          </div>
          <div
            className={classNames('col-right', rigthViewClass)}
            style={rigthViewStyle}
          >
            {RSideBar}

            <div className={classNames('col-inner-content', contentClass)}>
              {React.cloneElement(RightPanelView as any, {
                ...rest,
                user,
                theme: theme || user.userThemeId,
                twoPanelLayout: true,
              })}
            </div>
          </div>
        </BrowserView>
        <MobileView
          className={classNames('two--panel-layout-', 'mobile_view')}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {RSideBar}
          {LSideBar}
          <AnimatePresence initial={false}>
            {activeView === 'left' || rendering.current ? (
              <div key="1" style={{ height: '100%' }}>
                <PageTransition variants={ltl as Variants}>
                  <div
                    className={classNames('col-left', leftViewClass)}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      ...leftViewStyle,
                    }}
                  >
                    <div
                      className={classNames('col-inner-content', contentClass)}
                    >
                      {React.cloneElement(LeftPanelView as any, {
                        ...rest,
                        user,
                        theme: theme || user.userThemeId,
                        scrollref: leftSCrollbarRef,
                        refobj: leftPanelRef,
                        onleftscrollposition,
                      })}
                    </div>
                  </div>
                </PageTransition>
              </div>
            ) : (
              <div key="2" style={{ height: '100%' }}>
                <PageTransition variants={rtr as Variants}>
                  <div
                    className={classNames('col-right', rigthViewClass)}
                    style={rigthViewStyle}
                  >
                    <div
                      className={classNames('col-inner-content', contentClass)}
                    >
                      {defaultBackButton && (
                        <EditBack
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDefaultBackclick?.();
                            showLeftView();
                          }}
                        />
                      )}
                      {React.cloneElement(RightPanelView as any, {
                        ...rest,
                        user,
                        theme: theme || user.userThemeId,
                        twoPanelLayout: true,
                        scrollref: rightScrollbarRef,
                        refobj: rightPanelRef,
                        onrightscrollposition,
                      })}
                    </div>
                  </div>
                </PageTransition>
              </div>
            )}
          </AnimatePresence>
        </MobileView>
      </div>
    </div>
  );
}

export default styled(Layout)`
  .two--panel-layout {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    #wrapper {
      min-height: calc(100vh - 114px) !important;
    }
    .container.mb-80 {
      margin-bottom: 20px !important;
    }
    .card-item-holder {
      @media (min-width: 1024px) {
        width: 33.333%;
      }
    }

    > .col-left {
      display: flex;
      flex-direction: column;
    }

    &.desktop_view {
      .col-left {
        &.small-width {
          width: 420px;
          min-width: 420px;

          .rc-scollbar {
            width: 420px;
          }
        }
      }
    }
  }
  .col-left {
    width: 600px;
    background: var(--pallete-background-gray);
    min-width: 600px;
    &.large-width {
      width: 850px;
    }
    .custom-scroll-bar > div:nth-child(1) {
      overflow-x: hidden !important;
      margin-bottom: 0px !important;
    }

    @media (max-width: 1023px) {
      width: 100%;
      min-width: inherit;
    }

    .rc-scollbar {
      width: 600px;

      @media (max-width: 1023px) {
        width: 100%;
      }
    }

    .card-body-wrapper {
      .rc-scollbar {
        width: 100%;
      }
    }
  }
  .col-left::after {
    width: 1px;
    height: 100%;
    background: var(--pallete-colors-border) !important;
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;

    .sp_dark & {
      background: #353535 !important;
    }

    @media (max-width: 1023px) {
      display: none;
    }
  }
  .rc-scollbar {
    height: 100%;
  }

  #twopanellayout {
    @media (max-width: 767px) {
      /* height: auto !important; */
    }
  }

  .col-left .col-inner-content {
    padding: 24px 18px;
    height: 100%;
    width: 100%;

    > div:only-child {
      height: 100%;

      > div:only-child {
        height: 100%;
      }
    }

    .pop__edit {
      min-height: 100%;
      background: var(--pallete-background-default);
    }
  }
  .col-right {
    height: 100%;
    flex-grow: 1;
    flex-basis: 0;
  }
  .col-inner-content {
    height: 100%;
  }
  .mobile_view {
    height: 100%;

    .col-left {
      width: 100%;
      /* min-height: calc(100vh - 244px); */
      height: 100%;

      &.small-height {
        min-height: calc(100vh - 194px);
      }
    }

    .col-inner-content {
      width: 600px;
      min-width: 600px;
      margin: 0 auto;

      @media (max-width: 1023px) {
        width: 100%;
        min-width: inherit;
      }

      @media (max-width: 767px) {
        padding-bottom: 15px;
      }
    }

    .card-item-holder {
      @media (min-width: 1024px) {
        width: 33.333%;
      }
    }

    .button-holder {
      width: 100%;
    }

    .purchase-page {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }

  ${({ defaultRightSide }) =>
    defaultRightSide && `.col-right .col-inner-content { padding:0px }`}
`;
