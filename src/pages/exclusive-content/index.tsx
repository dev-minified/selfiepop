import { MembersIcon, Profile, RedirectLinkIcon } from 'assets/svgs';
import Tabs from 'components/SPTabs';
import SubscriberRightSider from 'pages/my-members/Members/components/MembersModified';
import Subscriber from 'pages/my-members/Members/MemberListing';
import RightScreenModified from 'pages/subscriptions/RightScreenModified';
import { ReactNode, useEffect, useState } from 'react';
import { Link, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import SlideAnimation from 'animations/SlideAnimation';
import ComponentsHeader from 'components/ComponentsHeader';
import { AnimatePresence } from 'framer-motion';
import useAuth from 'hooks/useAuth';
import useBottomNavToggler from 'hooks/useBottomnavToggle';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import TwoPanelLayoutWithouScroll from 'layout/TwoPanelLayoutWithouScroll';
import SubListing from 'pages/subscriptions/indexmodified';
import { isDesktop } from 'react-device-detect';
type Props = {
  className?: string;
  isSub?: boolean;
};
type BackProps = {
  className?: string;
  onbackClick?: (e: any) => void;
};
type MiddleBarProps = {
  className?: string;
  onbackClick?: (e: any) => void;
  username?: string;
};
const RedirectIcon = styled(RedirectLinkIcon)`
  cursor: pointer;
`;
const BacktopComponent = (props: BackProps) => {
  const { onbackClick } = props;

  return <ComponentsHeader onClick={onbackClick} title="EXCLUSIVE CONTENT" />;
};
const MiddleBar = (props: MiddleBarProps) => {
  const { onbackClick, username } = props;

  const link = `${window.location.host}/${username}`.replace('www.', '');
  return (
    <ComponentsHeader
      onClick={onbackClick}
      title={
        <Link
          to={`/${username}`}
          className="header-link-area__link"
          target="_blank"
        >
          <span className="user-profile-preifx">{window.location.host}/</span>
          {username}
        </Link>
      }
      icon={
        <>
          <RedirectIcon
            width={30}
            height={30}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`/${username}`, '_blank');
            }}
          />
        </>
      }
    />
  );
};
const TabPane = Tabs.TabPane;

const HandleBottomNavigation = ({
  showNave,
  applyClass,
  children,
}: {
  showNave: boolean;
  applyClass: boolean;

  children: ReactNode;
}) => {
  const { onBottomNavToggle } = useBottomNavToggler();

  useEffect(() => {
    if (!isDesktop) {
      onBottomNavToggle({ showNav: showNave, applyClass: applyClass });
    }
  }, [applyClass, showNave]);

  return <>{children}</>;
};
const tabKeys = {
  sub: `/messages/subscriptions`,
  member: '/messages/subscribers',
};
const ActivTabs = () => {
  const isActiveSeller = useAuth()?.user?.isActiveSeller;
  const location = useLocation();

  const [acitveKey, setActiveKey] = useState(location.pathname);
  const history = useHistory();
  useEffect(() => {
    setActiveKey(location.pathname);

    return () => {};
  }, [location.pathname]);

  const handleTabChange = (event: any) => {
    history.push(event);
    setActiveKey(event);
  };
  if (!isActiveSeller) {
    return (
      <HandleBottomNavigation showNave={true} applyClass={true}>
        <SubListing />
      </HandleBottomNavigation>
    );
  }
  return (
    <>
      <AnimatePresence initial={false} key={acitveKey}>
        <Tabs
          onTabClick={handleTabChange}
          // className={`memerbstabs  ${!!selectedSubscription?._id ? '' : 'block'}`}
          defaultActiveKey={acitveKey}
          type="card"
          destroyInactiveTabPane
        >
          <TabPane
            className="left-tabs"
            tab={
              <span
                id="sp_sales"
                className="d-flex justify-content-center align-items-center"
              >
                <Profile />
                <span>Subscriptions</span>
              </span>
            }
            key={tabKeys.sub}
          >
            <SlideAnimation type="left">
              <HandleBottomNavigation showNave={true} applyClass={true}>
                <SubListing />
              </HandleBottomNavigation>
            </SlideAnimation>
          </TabPane>
          <TabPane
            tab={
              <span
                id="sp_oders"
                className="d-flex justify-content-center align-items-center"
              >
                <MembersIcon />
                <span>Members</span>
              </span>
            }
            key={tabKeys.member}
          >
            <SlideAnimation type="right">
              <HandleBottomNavigation showNave={true} applyClass={true}>
                <Subscriber />
              </HandleBottomNavigation>
            </SlideAnimation>
          </TabPane>
        </Tabs>
      </AnimatePresence>
    </>
  );
};
const RightView = () => {
  const location = useLocation();
  return (
    <Switch location={location} key={location.pathname}>
      <Route path={'/messages/subscriptions'} exact>
        <HandleBottomNavigation showNave={false} applyClass={true}>
          <RightScreenModified topBar={<MiddleBar />} />
        </HandleBottomNavigation>
      </Route>
      <Route path={'/messages/subscribers'} exact>
        <HandleBottomNavigation showNave={false} applyClass={true}>
          <SubscriberRightSider topBar={<MiddleBar />} />
        </HandleBottomNavigation>
      </Route>
    </Switch>
  );
};
const RenderBackComponent = () => {
  const { activeView } = useControllTwopanelLayoutView();

  const onClick = () => {};
  return activeView === 'left' ? (
    <BacktopComponent onbackClick={onClick} />
  ) : null;
};
const Index = (props: Props) => {
  const { className } = props;
  const location = useLocation();
  const history = useHistory();
  const { onBottomNavToggle } = useBottomNavToggler();
  const onBackClick = () => {
    history.push({
      pathname: location.pathname,
      search: '',
    });
  };
  useEffect(() => {
    return () => {
      if (!isDesktop) {
        onBottomNavToggle({ showNav: true, applyClass: false });
      }
    };
  }, []);
  return (
    <div className={className}>
      <TwoPanelLayoutWithouScroll
        onDefaultBackclick={onBackClick}
        classes={{
          content: 'exclusive-content',
          rightView: 'exclusive-right',
          leftView: 'exclusive-left',
        }}
        LeftSidebar={<RenderBackComponent />}
        rightSubHeader={false}
        leftSubHeader={false}
        leftView={<ActivTabs />}
        rightView={<RightView />}
      />
    </div>
  );
};

export default styled(Index)`
  .exclusive-left .rc-tabs-content-holder {
    flex-grow: 1;
    flex-basis: 0;
    background: var(--pallete-background-default);
    position: relative;
    overflow: hidden;
    height: 100%;
    /* @media (max-width: 767px) { */
    /* for mobile messages section */
    /* min-height: calc(100vh - 250px);
    } */
  }

  .members-filters-form {
    /*background: var(--pallete-background-gray); */
  }
  .exclusive-left {
    .rc-tabs-tab {
      border-bottom: 2px solid #292929;
      color: #666666;
    }
    .rc-tabs-tab-active {
      border-bottom-color: var(--pallete-primary-main);
      color: var(--pallete-primary-main);

      .sp_dark & {
        color: var(--pallete-text-main);
      }
    }
    .rc-tabs-nav {
      width: 100%;
      .rc-tabs-nav-wrap {
        max-width: 536px;
        width: 100%;
        margin: 0 auto;
        padding: 0 20px;

        @media (max-width: 767px) {
          padding: 0 10px;
        }
      }
    }
  }
  .rc-tabs-content,
  .rc-tabs-tabpane {
    height: 100%;
  }

  /* .rc-tabs-tab-active {
    border-bottom-color: var(--pallete-primary-main);
    color: var(--pallete-primary-main);
  }
  .rc-tabs-tab {
    border-bottom: 1px solid #666666;
  } */
  .sublisting,
  .chat-user-listing {
    padding: 0;
    background: var(--pallete-background-gray);

    .rc-scollbar {
      width: 100%;
    }

    .members-filters-form {
      margin: 0 0 10px;
    }

    .user-listings {
      padding: 0 20px;

      @media (max-width: 767px) {
        padding: 0 10px;
      }
    }
  }
  .exclusive-content .col-left {
    padding: 5px 0 0 0 !important;
  }
  .exclusive-right {
    position: relative;

    .slide-header {
      border-right: none;
    }

    .right-col {
      width: 390px;

      @media (max-width: 1399px) {
        width: 320px;
      }

      @media (max-width: 1199px) {
        width: 280px;
      }
    }
  }
  .col-left .exclusive-content {
    height: 100%;
    padding-right: 0;
    padding-left: 0;
    padding-bottom: 0;
    padding-top: 8px;
  }

  /* members listing and subscription listing */
  .rc-tabs-mobile .user-listings {
    max-width: 536px;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 60px;
  }
  .desktop_view {
    .exclusive-left {
      width: 420px;
      min-width: 420px;
      .rc-scollbar {
        width: 100%;
      }
    }
  }
`;
