import classNames from 'classnames';
import MessageToast from 'components/MessageToast';
import OnBoardingTour from 'components/OnboardingTour';
import Header from 'components/partials/header';
import Sidebar from 'components/partials/Sidebar';

import SingleBarSubHeader from 'components/partials/SingleBarSubHeader';
import useBottomNavToggler from 'hooks/useBottomnavToggle';
import React, { ReactNode, useCallback } from 'react';
import { BrowserView, isMobileOnly } from 'react-device-detect';
import { matchPath, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getLocalStorage } from 'util/index';
import { MainRightWrapper, MainWrapper } from './selfie-pop.styled';
import AddCardWelcomModal from './SelfiePop/AddCardWelcomModal';
import SefiepopSpecialNotification from './SelfiePop/SefiepopSpecialNotification';
import SelfiepopGeneralSocket from './SelfiePop/SelfiepopGeneralSocket';
import SelfiePopNotificatonAndHeaderWrapper from './SelfiePop/SelfiePopNotificatonAndHeaderWrapper';
interface ISelfiePopProps {
  showHeaderMenu?: boolean;
  showHeader?: boolean;
  children?: ReactNode;
  className?: string;
}

const SelfiePopLayout: React.FC<ISelfiePopProps> = (props) => {
  const { showHeaderMenu = true, showHeader = true, className } = props;
  const history = useHistory();

  const { showNav, applyClass } = useBottomNavToggler();

  const showMessageToast = useCallback((data: any) => {
    const isSeller = data.chat.sentFrom !== 'BUYER';
    const isPaymentComplete = !data.isPaymentComplete;

    const subId = data.chat?.subscriptionId;
    toast(
      <MessageToast
        message={data.chat}
        user={data.user}
        eventType={data.type}
        className="toast-chat"
      />,
      {
        className: 'message-toast',
        closeOnClick: true,
        onClick: () => {
          if (!isPaymentComplete) {
            // return history.push(
            //   `/my-members/subscriber?userId=${data.user._id}`,
            // );
            return history.push(
              `/messages/subscribers?userId=${data.user._id}`,
            );
          } else if (isSeller) {
            return history.push(
              `/messages/subscriptions?userId=${data.user._id}&subId=${subId}&type=chat`,
            );
            // return history.push(
            //   `/my-subscriptions?userId=${data.user._id}&type=chat`,
            // );
          } else {
            // return history.push(`/my-sales?userId=${data.user._id}&type=chat`);
            // return history.push(
            //   `/my-members/subscriber?userId=${data.user._id}`,
            // );
            return history.push(
              `/messages/subscribers?userId=${data.user._id}`,
            );
          }
          // history.push(`/chat?subscription=${data.chat.subscriptionId}`),
        },
      },
    );
  }, []);

  const OBT = getLocalStorage('onBoardingTour', false) === 'true';
  const isMyProfile = matchPath(history.location.pathname, {
    path: '/my-profile',
    strict: false,
  });
  const isDesktop = showHeaderMenu && !isMobileOnly;

  return (
    <>
      <SelfiepopGeneralSocket showMessageToast={showMessageToast} />
      <BrowserView>{OBT && isMyProfile && <OnBoardingTour />}</BrowserView>
      {isMobileOnly ? (
        <SelfiePopNotificatonAndHeaderWrapper
          showHeaderMenu={!!showHeaderMenu}
          className="ntf_bar"
        >
          <SefiepopSpecialNotification />
        </SelfiePopNotificatonAndHeaderWrapper>
      ) : null}
      <div
        id="wrapper"
        className={classNames(
          'd-flex flex-column min-vh-100 wrapper-box',
          `${className}`,
          {
            bottomnavHidden: !showNav || applyClass,
            appmobileView: isMobileOnly,
            appdesktopView: !isMobileOnly,
          },
        )}
      >
        {showHeaderMenu && isMobileOnly ? (
          <SelfiePopNotificatonAndHeaderWrapper
            showHeaderMenu={!!showHeaderMenu}
            showHeader={showHeader}
          >
            <Header />
          </SelfiePopNotificatonAndHeaderWrapper>
        ) : null}
        <MainWrapper>
          {showHeaderMenu && !isMobileOnly ? (
            <SelfiePopNotificatonAndHeaderWrapper
              showHeaderMenu={!!showHeaderMenu}
              showHeader={showHeader}
            >
              <Sidebar />
            </SelfiePopNotificatonAndHeaderWrapper>
          ) : null}

          <MainRightWrapper
            id="main"
            className={`flex-grow-1 ${isDesktop ? 'desktop_sidebar' : ''}`}
          >
            {!isMobileOnly ? (
              <SelfiePopNotificatonAndHeaderWrapper
                showHeaderMenu={!!showHeaderMenu}
                className="ntf_bar"
              >
                <SefiepopSpecialNotification />
              </SelfiePopNotificatonAndHeaderWrapper>
            ) : null}
            <SingleBarSubHeader />
            {props.children}
          </MainRightWrapper>
        </MainWrapper>
      </div>
      <AddCardWelcomModal />
    </>
  );
};

export default SelfiePopLayout;
