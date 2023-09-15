import classNames from 'classnames';
import Scrollbar from 'components/Scrollbar';
import LeftSideBarSubHeader from 'components/partials/LeftSideBarSubHeader';
import RightSideBarSubHeader from 'components/partials/RightSideBarSubHeader';
import EditBack from 'components/partials/components/profileBack';
import { AnimatePresence, Variants } from 'framer-motion';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import React, { ReactElement, useEffect, useRef } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router-dom';
import styled, { CSSProperties } from 'styled-components';
import { parseQuery } from 'util/index';
import PageTransition from './page-transition';

const mtr = {
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
  middleView?: React.ReactNode;
  defaultRightSide?: boolean;
  classes?: {
    leftView?: string;
    rightView?: string;
    middleView?: string;
    content?: string;
  };
  styles?: {
    leftView?: CSSProperties;
    rightView?: CSSProperties;
    middleView?: CSSProperties;
  };
  className?: string;
  children?: JSX.Element | JSX.Element[];
  defaultBackButton?: boolean;
  leftSubHeader?: boolean;
  rightSubHeader?: boolean;
  middleSubHeader?: boolean;
  isMiddleScroll?: boolean;
  isLeftScroll?: boolean;
  isRightScroll?: boolean;
  threepanelId?: string;
  LeftHeader?: React.ReactNode;
  RightHeader?: React.ReactNode;
  MiddleHeader?: React.ReactNode;
  onDefaultBackclick?: () => void;
}
const LeftSideSubHeaderNotAllowed: any[] = [];
const MiddleSideSubHeaderNotAllowed: any[] = [
  '/my-purchases',
  '/my-sales',
  'vault',
  '/support',
  '/onboarding/theme-selection',
  '/onboarding/private-pop-setup',
  '/onboarding/set-password',
];
const RightSideSubHeaderNotAllowed: any[] = [];
export const setTwoPanelLayoutHeight = () => {
  setTimeout(() => {
    const ele = document.getElementById('threepanellayout');
    ele?.setAttribute(
      'style',
      `
      height: calc(100vh - ${ele?.getBoundingClientRect().y}px)
    `,
    );
  }, 0);
};
let timeout: any;
export function Layout({
  leftView,
  rightView = <React.Fragment></React.Fragment>,
  middleView,
  classes = {},
  styles = {},
  className = '',
  children,
  threepanelId = 'threepanellayout',
  leftSubHeader = true,
  rightSubHeader = true,
  middleSubHeader = true,
  isMiddleScroll = false,
  isLeftScroll = false,
  isRightScroll = false,
  defaultBackButton = true,
  LeftHeader = null,
  RightHeader = null,
  MiddleHeader = null,
  onDefaultBackclick,
  ...rest
}: Props): ReactElement {
  const { user } = useAuth();

  const { activeView, showLeftView } = useControllTwopanelLayoutView();
  const location = useLocation();
  const { slider } = parseQuery(location.search);
  useEffect(() => {
    showLeftView();
  }, [location.pathname, showLeftView]);
  const rendering = useRef(true);
  const rightScrollbarRef = useRef<any>(null);
  const middleScrollbarRef = useRef<any>(null);
  const middlePanelRef = useRef<any>(null);
  const leftSCrollbarRef = useRef<any>(null);
  const leftPanelRef = useRef<any>(null);
  const rightPanelRef = useRef<any>(null);

  const {
    leftView: leftViewClass,
    rightView: rigthViewClass,
    middleView: middleViewClass,
    content: contentClass,
  } = classes;
  const {
    leftView: leftViewStyle,
    rightView: rigthViewStyle,
    middleView: middleViewStyle,
  } = styles;

  const theme = useAppSelector((state) => state.theme?.current);
  const history = useHistory();

  const Childrens = React.Children.toArray(children);
  let LeftPanelView = leftView;
  let RightPanelView = rightView;
  let MiddlePanelView = middleView;
  if (Childrens.length === 3) {
    LeftPanelView = Childrens[0];
    MiddlePanelView = Childrens[1];
    RightPanelView = Childrens[2];
  }
  useEffect(() => {
    clearTimeout(timeout);
    if (
      rightScrollbarRef?.current ||
      leftSCrollbarRef?.current ||
      middleScrollbarRef?.current
    )
      timeout = setTimeout(() => {
        rightScrollbarRef?.current?.forceUpdate();
        leftSCrollbarRef?.current?.forceUpdate();
        middleScrollbarRef?.current?.forceUpdate();
      }, 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.pathname,
    rightScrollbarRef?.current,
    leftSCrollbarRef?.current,
    middleScrollbarRef?.current,
  ]);
  useEffect(() => {
    setTwoPanelLayoutHeight();
    showLeftView();
    rendering.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeftScroll = async (event: any) => {
    if (
      leftPanelRef.current &&
      leftSCrollbarRef.current &&
      middleScrollbarRef.current
    ) {
      const { scrollTop, scrollHeight, clientHeight } =
        leftSCrollbarRef.current.view;
      const pad = 1; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1) {
        leftPanelRef?.current?.handleScroll(event);
      }
    }
  };
  const handleRightScroll = async (event: any) => {
    if (
      leftPanelRef.current &&
      rightScrollbarRef.current &&
      middleScrollbarRef.current
    ) {
      const { scrollTop, scrollHeight, clientHeight } =
        rightScrollbarRef.current.view;
      const pad = 1; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1) {
        rightPanelRef?.current?.handleScroll(event);
      }
    }
  };
  const handleMiddleScroll = async (event: any) => {
    if (
      leftPanelRef.current &&
      rightScrollbarRef.current &&
      middleScrollbarRef.current
    ) {
      const { scrollTop, scrollHeight, clientHeight } =
        middleScrollbarRef.current.view;
      const pad = 1; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1) {
        middlePanelRef?.current?.handleScroll(event);
      }
    }
  };
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
  const onmiddlescrollposition = async (time = 0) => {
    if (middleScrollbarRef.current) {
      setTimeout(() => {
        middleScrollbarRef?.current?.scrollToTop();
      }, time);
    }
  };

  return (
    <div className={classNames(className)}>
      <div id={threepanelId}>
        <BrowserView
          className={classNames('desktop_view', 'three--panel-layout')}
          style={{ height: '100%' }}
        >
          <div
            className={classNames('col-left', leftViewClass)}
            style={{ position: 'relative', zIndex: 1, ...leftViewStyle }}
          >
            {!!leftSubHeader ? (
              <>{LeftHeader ? LeftHeader : null}</>
            ) : (
              <LeftSideBarSubHeader />
            )}
            {!isLeftScroll ? (
              <div className={classNames('col-inner-content', contentClass)}>
                {React.cloneElement(LeftPanelView as any, {
                  ...rest,
                  scrollref: leftSCrollbarRef,
                  user,
                  theme: theme || user.userThemeId,
                })}
              </div>
            ) : (
              <Scrollbar
                className="custom-scroll-bar"
                style={{ overflowX: 'hidden' }}
                ref={leftSCrollbarRef}
                onScroll={handleLeftScroll}
              >
                <div className={classNames('col-inner-content', contentClass)}>
                  {React.cloneElement(LeftPanelView as any, {
                    ...rest,
                    scrollref: leftSCrollbarRef,
                    refobj: leftPanelRef,
                    user,
                    theme: theme || user.userThemeId,
                    onleftscrollposition,
                  })}
                </div>
              </Scrollbar>
            )}
          </div>
          <div
            className={classNames('col-middle', middleViewClass)}
            style={middleViewStyle}
          >
            {middleSubHeader ? (
              <>{!!MiddleHeader ? MiddleHeader : null}</>
            ) : (
              <RightSideBarSubHeader user={user} />
            )}
            {!isMiddleScroll ? (
              <div className={classNames('col-inner-content', contentClass)}>
                {React.cloneElement(MiddlePanelView as any, {
                  ...rest,
                  user,
                  theme: theme || user.userThemeId,
                  threePanelLayout: true,
                })}
              </div>
            ) : (
              <Scrollbar
                className="custom-scroll-bar"
                ref={middleScrollbarRef}
                onScroll={handleMiddleScroll}
              >
                <div className={classNames('col-inner-content', contentClass)}>
                  {React.cloneElement(MiddlePanelView as any, {
                    ...rest,
                    user,
                    scrollref: middleScrollbarRef,
                    refobj: middlePanelRef,
                    theme: theme || user.userThemeId,
                    threePanelLayout: true,
                    onmiddlescrollposition,
                  })}
                </div>
              </Scrollbar>
            )}
          </div>
          <div
            className={classNames('col-right', rigthViewClass)}
            style={rigthViewStyle}
          >
            {rightSubHeader ? (
              <>{!!RightHeader ? RightHeader : null}</>
            ) : (
              <RightSideBarSubHeader user={user} />
            )}
            {!isRightScroll ? (
              <div className={classNames('col-inner-content', contentClass)}>
                {React.cloneElement(RightPanelView as any, {
                  ...rest,
                  user,
                  theme: theme || user.userThemeId,
                  twoPanelLayout: true,
                })}
              </div>
            ) : (
              <Scrollbar
                className="custom-scroll-bar"
                ref={rightScrollbarRef}
                onScroll={handleRightScroll}
              >
                <div className={classNames('col-inner-content', contentClass)}>
                  {React.cloneElement(RightPanelView as any, {
                    ...rest,
                    user,
                    scrollref: rightScrollbarRef,
                    refobj: rightPanelRef,
                    theme: theme || user.userThemeId,
                    twoPanelLayout: true,
                    onrightscrollposition,
                  })}
                </div>
              </Scrollbar>
            )}
          </div>
        </BrowserView>
        <MobileView
          className={classNames('three--panel-layout-', 'mobile_view')}
        >
          {leftSubHeader ? (
            <>{!!LeftHeader ? LeftHeader : null}</>
          ) : (
            <LeftSideBarSubHeader />
          )}
          {middleSubHeader ? (
            <>{!!MiddleHeader ? MiddleHeader : null}</>
          ) : (
            <RightSideBarSubHeader user={user} />
          )}
          <AnimatePresence initial={false}>
            {activeView === 'left' || rendering.current ? (
              <div key="1">
                <PageTransition variants={ltl as Variants}>
                  <div
                    className={classNames('col-left', leftViewClass)}
                    style={{
                      position: 'relative',
                      zIndex: 1,
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
              <div key="2">
                <PageTransition variants={mtr as Variants}>
                  <div
                    className={classNames('col-middle', middleViewClass)}
                    style={middleViewStyle}
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
                      {React.cloneElement(MiddlePanelView as any, {
                        ...rest,
                        user,
                        theme: theme || user.userThemeId,
                        threePanelLayout: true,
                        scrollref: middleScrollbarRef,
                        refobj: middlePanelRef,
                        onmiddlescrollposition,
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
  .three--panel-layout {
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
  }
  .col-left {
    width: 600px;
    background: var(--pallete-background-gray);
    min-width: 600px;

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

    @media (max-width: 1023px) {
      display: none;
    }
  }
  .rc-scollbar {
    height: 100%;
  }

  #threepanellayout {
    @media (max-width: 767px) {
      height: auto !important;
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
  .col-middle {
    flex-grow: 1;
    flex-basis: 0;
  }
  .col-right {
    width: 390px;
    .col-inner-content {
      height: 100%;
    }
  }
  .mobile_view {
    .col-left {
      width: 100%;
      min-height: calc(100vh - 244px);

      &.small-height {
        min-height: calc(100vh - 194px);
      }
    }

    .col-inner-content {
      height: 100%;
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
  }

  ${({ defaultRightSide }) =>
    defaultRightSide && `.col-middle .col-inner-content { padding:0px }`}
`;
