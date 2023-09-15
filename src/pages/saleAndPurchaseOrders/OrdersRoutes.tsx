import SlideAnimation from 'animations/SlideAnimation';
import { RequestIcon, UnlockOrdersIcon } from 'assets/svgs';
import ComponentsHeader from 'components/ComponentsHeader';
import Scrollbar from 'components/Scrollbar';
import Tabs from 'components/Tabs';
import { AnimatePresence } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import TwoPanelLayoutWithouScroll from 'layout/TwoPanelLayoutWithouScroll';
import { ReactElement, useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { Switch, useHistory, useLocation } from 'react-router-dom';
import RcRoute from 'routes/components/RcRoute';
import { resetSalesOrders } from 'store/reducer/Orders';
import { resetPurchaseOrders } from 'store/reducer/purchaseOrder';
import styled from 'styled-components';
import PurchaseRecieptInfo from './PurchaseRightDetails';
import PurchasesMiddleView from './PurchasesMiddleView';
import PurchasesRoomListing from './PurchasesRoomListing';
import SalesMiddleView from './SalesMiddleView';
import RecipientInfo from './SalesRecipientInfo';
import SalesRoomListing from './SalesRoomListing';

const TabPane = Tabs.TabPane;
type BackProps = {
  className?: string;
  onbackClick?: (e: any) => void;
  onTogglePrev?: (e: any) => void;
  onToggleNext?: (e: any) => void;
};

const BacktopComponent = (props: BackProps) => {
  const { onbackClick } = props;
  const { activeView } = useControllTwopanelLayoutView();

  return activeView !== 'right' || !!isDesktop ? (
    <ComponentsHeader onClick={onbackClick} title="ORDERS" />
  ) : (
    <></>
  );
};
const ActiveTabs = () => {
  const path = useLocation();
  const [acitveKey, setActiveKey] = useState(path.pathname);
  const history = useHistory();

  const { idIsVerified, showSellerMenu, isEmailVerified } = useAuth()?.user;
  const { showRightView } = useControllTwopanelLayoutView();
  useEffect(() => {
    setActiveKey(path.pathname);

    return () => {};
  }, [path.pathname]);

  const handleTabChange = (event: any) => {
    history.push(event);
    setActiveKey(event);
  };
  const allowSellMenu = showSellerMenu && idIsVerified && isEmailVerified;
  let View = (
    <AnimatePresence initial={false} key={acitveKey}>
      <Tabs
        destroyInactiveTabPane={true}
        onChange={handleTabChange}
        className={`orders-tabs`}
        type="card"
        defaultActiveKey={acitveKey}
      >
        <TabPane
          tab={
            <span
              id="sp_test_user_info"
              className="d-flex justify-content-center align-items-center"
            >
              <RequestIcon />
              <span className="text">Requests</span>
            </span>
          }
          key="/orders/my-sales"
        >
          <Scrollbar
            className="custom-scroll-bar"
            style={{ overflowX: 'hidden' }}
          >
            <SlideAnimation type="left">
              <SalesRoomListing showRightView={showRightView} />
            </SlideAnimation>
          </Scrollbar>
        </TabPane>
        <TabPane
          tab={
            <span
              id="sp_test_user_info"
              className="d-flex justify-content-center align-items-center"
            >
              <UnlockOrdersIcon />
              <span className="text">Unlocked</span>
            </span>
          }
          key="/orders/my-purchases"
        >
          <Scrollbar
            className="custom-scroll-bar"
            style={{ overflowX: 'hidden' }}
          >
            <SlideAnimation type="right">
              <PurchasesRoomListing showRightView={showRightView} />
            </SlideAnimation>
          </Scrollbar>
        </TabPane>
      </Tabs>
    </AnimatePresence>
  );
  if (!allowSellMenu) {
    View = (
      <AnimatePresence initial={false} key={acitveKey}>
        <Scrollbar
          className="custom-scroll-bar"
          style={{ overflowX: 'hidden' }}
        >
          <SlideAnimation type="right">
            <PurchasesRoomListing showRightView={showRightView} />
          </SlideAnimation>
        </Scrollbar>
      </AnimatePresence>
    );
  }
  return View;
};
const Orders = ({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement => {
  const dispatch = useAppDispatch();

  const { showLeftView } = useControllTwopanelLayoutView();
  useEffect(() => {
    dispatch(resetPurchaseOrders());
    dispatch(resetSalesOrders());
    showLeftView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RightView = () => {
    return (
      <Switch>
        <RcRoute path={'/orders/my-sales'} exact>
          <>
            <SalesMiddleView />
            {isDesktop && <RecipientInfo />}
          </>
        </RcRoute>
        <RcRoute path={'/orders/my-purchases'} exact>
          <>
            <PurchasesMiddleView />
            {isDesktop && <PurchaseRecieptInfo />}
          </>
        </RcRoute>
      </Switch>
    );
  };

  return (
    <div className={className}>
      <TwoPanelLayoutWithouScroll
        LeftSidebar={<BacktopComponent />}
        rightSubHeader={false}
        leftSubHeader={false}
        defaultBackButton={false}
        classes={{
          rightView: 'small-width',
          content: 'p-0',
          leftView: 'small-height small-width',
        }}
        leftView={<ActiveTabs />}
        rightView={<RightView />}
      />
    </div>
  );
};
export default styled(Orders)`
  .custom-scroll-bar {
    .rc-scollbar {
      width: 100%;
    }
  }
  .rc-tabs-content-holder {
    flex-grow: 1;
    flex-basis: 0;
    background: var(--pallete-background-default);
    position: relative;
    overflow: hidden;
  }
  .orders-tabs {
    /* padding: 32px 0 0; */
    @media (max-width: 767px) {
      padding: 15px 0 0;
    }
  }
  .rc-tabs-nav,
  .rc-scollbar {
    padding: 0 32px;
    @media (max-width: 767px) {
      padding: 0 15px;
    }
  }
  .rc-tabs-content {
    height: 100%;
  }
  .rc-tabs-tabpane {
    height: 100%;
  }
  .animated-block,
  .animated-block-area {
    height: 100%;
  }
  .animated-block-area {
    display: flex;
  }
  .two--panel-layout {
    .col-right {
      .col-inner-content {
        display: flex;
        height: 100%;
      }
    }
  }
  .rc-tabs-card {
    .rc-tabs-content-holder {
      background: transparent;
    }
    .rc-tabs-nav-wrap {
      margin-top: 8px;

      .rc-tabs-nav-list {
        margin: 0;
      }
    }
    .rc-tabs-tab {
      flex-grow: 1;
      background: none;
      border: none;
      margin: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      justify-content: center;
      color: #666666;
      &::after {
        background: #666666;
        visibility: visible;
        opacity: 1;
      }
      :nth-child(2) {
        svg {
          path {
            fill: none;
          }
        }
      }
    }
    .rc-tabs-nav {
      &::after {
        visibility: hidden;
      }
    }

    .rc-tabs-tab-active {
      border-bottom: 1px solid var(--pallete-primary-main) !important;
      background: none !important;
      border: none;
      color: var(--pallete-primary-main);
      &::after {
        background: var(--pallete-primary-main);
      }

      .sp_dark & {
        color: var(--pallete-text-main);
      }
    }
  }

  .sort-box {
    padding-top: 20px;
  }
`;
