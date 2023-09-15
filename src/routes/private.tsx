import { getCounterLabel } from 'api/Utils';
import classNames from 'classnames';
import Loading from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import SinglePanelLayout from 'layout/SinglePanelLayout';
import ThemeSelector from 'layout/ThemeSelector';
import PageTransition from 'layout/page-transition';
import MessagesComponent from 'pages/exclusive-content/MessagesComponent';
import {
  Orderwrapper,
  ordersRouter,
} from 'pages/saleAndPurchaseOrders/OrderWrapper';
import { ReactElement, Suspense, lazy, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { headerCount } from 'store/reducer/counter';
import { getSupportTicketCount } from 'store/reducer/support';
import styled from 'styled-components';
import { MyMemberRouter } from './MembersRoutes';
import RcRoute from './components/RcRoute';
import { ManagedAccountsRoutes } from './managerRoutes';
import { onBoardingTour } from './onBoardingRoutes';
import { MyProfileRoutes } from './profileEditorRoutes';

const Success = lazy(() => import('pages/QRCode/liveevent/Success'));
const PunchTicket = lazy(() => import('pages/QRCode/liveevent/PunchTicket'));
const OnboardingProfilePhoto = lazy(
  () => import('pages/onboarding/profile-photo'),
);
const ThemeLibrary = lazy(() => import('pages/theme-library'));
const Orders = lazy(() => import('pages/saleAndPurchaseOrders/OrdersRoutes'));

const Vault = lazy(() => import('pages/my-vault'));
const NewFeeds = lazy(() => import('pages/my-feeds'));
const UserProfileFeed = lazy(() => import('pages/user-profiles'));
const AffliatedPage = lazy(() => import('pages/account/affiliate-program'));
const ThemePreview = lazy(() => import('pages/theme-library/preview'));
const ProfileEditorRoutes = lazy(() => import('./profileEditorRoutes'));
const MembersEditorRoutes = lazy(() => import('./MembersRoutes'));
const ManagerRoutes = lazy(() => import('./managerRoutes'));
const OnboardingRoutes = lazy(() => import('./onBoardingRoutes'));

const AccountSetting = lazy(() => import('pages/account/account-info'));
const Billing = lazy(() => import('pages/account/billing'));
const Payments = lazy(() => import('pages/account/payments/index'));
const Withdraw = lazy(() => import('pages/account/payments/withdraw'));
const SocialAccounts = lazy(() => import('pages/account/social-accounts'));
const Support = lazy(() => import('pages/account/support'));
const ContestThisOrder = lazy(() => import('pages/review/contest-this-order'));
const RateYourOrder = lazy(() => import('pages/review/rate-your-order'));
const ExclusiveContent = lazy(() => import('pages/exclusive-content'));
const ContestThisOrderInfo = lazy(
  () => import('pages/review/contest-this-order-info'),
);
const MyPuchase = lazy(() => import('pages/my-purchases'));
const MySales = lazy(() => import('pages/my-sales'));
const KnowledgeBase = lazy(() => import('pages/knowledge-base'));
export const RoutesArray = [
  '/review/contest-this-order',
  '/review/contest-this-order-info',
  '/review/rate-your-order',
  '/schedule-messaging',
  '/subscriber',
  '/unlocked',
  '/support',
  '/theme-library',
  '/theme-library/preview',
  '/account',
  '/drag',
  '/new-feeds',
  '/profile/:username',
  '/vault',
  '/account/social-accounts',
  '/account/billing',
  '/account/inner-circle',
  '/account/payments/withdraw',
  '/account/payments',
  '/my-sales',
  '/punchticket',
  '/punched-success',
  '/knowledge-base',
  '/knowledge-base/:knowledgeId',
  '/messages/subscriptions',
  '/messages/subscribers',
  '/messages',
  ...MyMemberRouter,
  ...ordersRouter,
  ...MyProfileRoutes,
  ...ManagedAccountsRoutes,
  ...onBoardingTour,
];
function Routes({ className }: { className?: string }): ReactElement {
  const dispatch = useAppDispatch();
  const loggedIn = useAuth()?.loggedIn;
  useEffect(() => {
    if (loggedIn) {
      dispatch(getSupportTicketCount());
      getCounterLabel()
        .then((counter) => {
          if (!counter.cancelled) {
            dispatch(headerCount(counter));
          }
        })
        .catch(console.error);
    }
  }, [dispatch, loggedIn]);

  return (
    <Suspense fallback={<Loading loading={true} />}>
      <div className={classNames(className)}>
        <Switch>
          <RcRoute path="/review" privateFC>
            <Switch>
              <RcRoute path="/review/contest-this-order" exact>
                <SinglePanelLayout>
                  <ContestThisOrder />
                </SinglePanelLayout>
              </RcRoute>
              <RcRoute path="/review/contest-this-order-info" exact>
                <SinglePanelLayout>
                  <ContestThisOrderInfo />
                </SinglePanelLayout>
              </RcRoute>
              <RcRoute path="/review/rate-your-order" exact>
                <SinglePanelLayout>
                  <RateYourOrder />
                </SinglePanelLayout>
              </RcRoute>
            </Switch>
          </RcRoute>
          <RcRoute path="/punchticket" exact privateFC>
            <PunchTicket />
          </RcRoute>
          <RcRoute path="/punched-success" exact privateFC>
            <PageTransition>
              <Success showdashboardbtn={false} />
            </PageTransition>
          </RcRoute>
          <RcRoute
            path={['/messages/subscriptions', '/messages/subscribers']}
            exact
            privateFC
          >
            <ExclusiveContent />
          </RcRoute>
          <RcRoute path={'/messages'} exact privateFC>
            <MessagesComponent />
          </RcRoute>

          <RcRoute path="/unlocked" exact privateFC>
            <MyPuchase />
          </RcRoute>
          <RcRoute path="/my-sales" exact privateFC>
            <MySales />
          </RcRoute>
          <RcRoute
            path={['/knowledge-base', '/knowledge-base/:knowledgeId']}
            exact
            privateFC
          >
            <KnowledgeBase />
          </RcRoute>
          <RcRoute path="/support" exact privateFC>
            <Support />
          </RcRoute>
          <RcRoute path="/theme-library" exact privateFC>
            <ThemeLibrary />
          </RcRoute>
          <RcRoute path="/theme-library/preview" exact privateFC>
            <ThemePreview />
          </RcRoute>
          <RcRoute path="/account" privateFC>
            <Switch>
              <Route path="/">
                <SinglePanelLayout>
                  <Switch>
                    <Route path="/account" exact>
                      <AccountSetting />
                    </Route>
                    <Route path="/account/social-accounts" exact>
                      <SocialAccounts />
                    </Route>
                    <Route path="/account/billing" exact>
                      <Billing />
                    </Route>
                    <Route path="/account/inner-circle" exact>
                      <AffliatedPage />
                    </Route>
                    <Route path="/account/payments/withdraw" exact>
                      <Withdraw />
                    </Route>
                    <Route path="/account/payments" exact>
                      <Payments />
                    </Route>
                  </Switch>
                </SinglePanelLayout>
              </Route>
            </Switch>
          </RcRoute>
          <RcRoute
            path="/onboarding"
            privateFC
            layoutProps={{
              showHeader: false,
              showHeaderMenu: false,
              className: 'onboarding_user',
            }}
          >
            <Switch>
              <Route path="/onboarding/profile-photo" exact>
                <PageTransition motionKey="">
                  <ThemeSelector isOnboarding>
                    <SinglePanelLayout>
                      <OnboardingProfilePhoto title="Private Pop Page" />
                    </SinglePanelLayout>
                  </ThemeSelector>
                </PageTransition>
              </Route>
              <RcRoute
                path="/onboarding"
                layoutProps={{
                  showHeader: false,
                  showHeaderMenu: false,
                }}
              >
                <PageTransition>
                  <OnboardingRoutes className="right-col-padding" />
                </PageTransition>
              </RcRoute>
            </Switch>
          </RcRoute>

          <RcRoute path="/my-profile" privateFC>
            <ProfileEditorRoutes className="right-col-padding" />
          </RcRoute>

          <RcRoute path="/my-members" privateFC>
            <MembersEditorRoutes className="right-col-padding" />
          </RcRoute>

          <RcRoute path="/managed-accounts" privateFC>
            <ManagerRoutes className="right-col-padding" />
          </RcRoute>
          <RcRoute path={['/new-feeds']} privateFC exact>
            <NewFeeds />
          </RcRoute>
          <RcRoute
            path={['/orders', '/orders/my-sales', '/orders/my-purchases']}
            privateFC
            exact
          >
            <Orderwrapper>
              <Orders />
            </Orderwrapper>
          </RcRoute>

          <RcRoute path={['/vault']} privateFC exact>
            <Vault />
          </RcRoute>
          <RcRoute path={['/profile/:username']} privateFC exact>
            <UserProfileFeed />
          </RcRoute>
        </Switch>
      </div>
    </Suspense>
  );
}
export default styled(Routes)`
  .right-col-padding .col-right {
    height: 100%;
    padding-top: 51px;
    position: relative;

    @media (max-width: 1023px) {
      padding-top: 0;
    }

    .header-link-area {
      width: 100%;
      right: auto;
      left: 0;
    }

    .haader_nav_right_area {
      display: flex;
      align-items: center;
      gap: 13px;

      &__icon {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.6;
        transition: all 0.4s ease;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;
