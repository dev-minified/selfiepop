import { AnimatePresence } from 'framer-motion';
import PageTransition from 'layout/page-transition';
import TwoPanelLayoutWithouScroll from 'layout/TwoPanelLayoutWithouScroll';
import ManagedAccounts from 'pages/managed-accounts';
import AccountDetails from 'pages/managed-accounts/account-details';
import ManagedRoutesWrapper from 'pages/managed-accounts/ManagedRoutesWrapper';
import MembershipLevels from 'pages/managed-accounts/membership-levels';
// import MembershipRulesManaged from 'pages/managed-accounts/membership-rules';
// import MembershipRuleCreate from 'pages/managed-accounts/membership-rules/create';
// import MembershipRuleEdit from 'pages/managed-accounts/membership-rules/edit';
import ScrollBarWrapper from 'components/ScrollBarWrapper';
import Schedule from 'pages/managed-accounts/schedule';
import ScheduleRightWrapper from 'pages/managed-accounts/schedule-right-wrapper';
import Subscribers from 'pages/managed-accounts/subscribers';
import ChatView from 'pages/managed-accounts/subscribers/ChatView';
import SubscriberDetails from 'pages/managed-accounts/subscribers/details';
import WallWrapper from 'pages/managed-accounts/WallWrapper';
import { ReactElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import RcAnimatePresence from './components/RcAnimatePresence';
export const ManagedAccountsRoutes: string[] = [
  '/managed-accounts',
  '/managed-accounts/:id',
  '/managed-accounts/:id/membership-levels',
  '/managed-accounts/:id/subscribers',
  '/managed-accounts/:id/subscribers/:subscriberId',
  // '/managed-accounts/:id/rules',
  // '/managed-accounts/:id/rules/create',
  // '/managed-accounts/:id/rules/:ruleId',
  '/managed-accounts/:id/schedule',
];
export default function Routes({
  className,
}: {
  className: string;
}): ReactElement {
  return (
    <TwoPanelLayoutWithouScroll
      classes={{ content: 'p-0' }}
      defaultBackButton={false}
      className={className}
    >
      <RcAnimatePresence>
        <Route path="/managed-accounts" exact>
          <PageTransition>
            <ManagedAccounts />
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id" exact>
          <PageTransition>
            <ScrollBarWrapper>
              <AccountDetails />
            </ScrollBarWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id/membership-levels" exact>
          <PageTransition>
            <ManagedRoutesWrapper>
              <MembershipLevels />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id/subscribers" exact>
          <PageTransition>
            <ManagedRoutesWrapper>
              <Subscribers />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id/subscribers/:subscriberId" exact>
          <PageTransition>
            <ManagedRoutesWrapper>
              <SubscriberDetails />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        {/* <Route path="/managed-accounts/:id/rules" exact>
          <PageTransition>
            <ManagedRoutesWrapper>
              <MembershipRulesManaged />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id/rules/create" exact>
          <PageTransition>
            <ManagedRoutesWrapper>
              <MembershipRuleCreate />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id/rules/:ruleId" exact>
          <PageTransition>
            <ManagedRoutesWrapper>
              <MembershipRuleEdit />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route> */}
        <Route path="/managed-accounts/:id/schedule" exact>
          <PageTransition>
            <ManagedRoutesWrapper>
              <Schedule />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
      </RcAnimatePresence>
      {/* Right */}
      <RightView />
    </TwoPanelLayoutWithouScroll>
  );
}

const RightView: React.FC = (props) => {
  return (
    <AnimatePresence>
      <Switch>
        <Route path="/managed-accounts/:id/schedule" exact>
          <PageTransition {...props} motionKey="schedule">
            <ManagedRoutesWrapper>
              <ScheduleRightWrapper />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id/subscribers/:subscriberId" exact>
          <PageTransition {...props} motionKey="chat">
            <ManagedRoutesWrapper>
              <ChatView />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts" exact>
          <PageTransition {...props} motionKey="managed-accounts">
            <ManagedRoutesWrapper>
              <WallWrapper />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
        <Route path="/managed-accounts/:id">
          <PageTransition {...props} motionKey="managed-accounts">
            <ManagedRoutesWrapper>
              <WallWrapper />
            </ManagedRoutesWrapper>
          </PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
};
