import Loading from 'components/SiteLoader';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RefreshToken from './RefreshToken';
import UsersSettings from './UsersSettings';
import { RoutesArray as guestRoutes } from './guest';
import { RoutesArray as privateRoutes } from './private';

const PublicRoutes = React.lazy(() => import('./public'));
const PrivateRoutes = React.lazy(() => import('./private'));
const GuestRoutes = React.lazy(() => import('./guest'));

const PrivateRoutesWrapper = () => {
  return (
    <React.Suspense fallback={<Loading loading={true} />}>
      <PrivateRoutes />
    </React.Suspense>
  );
};
const GuestRoutesWrapper = () => {
  return (
    <React.Suspense fallback={<Loading loading={true} />}>
      <GuestRoutes />
    </React.Suspense>
  );
};
const PublicPageWrapper = () => {
  return (
    <React.Suspense fallback={<Loading loading={true} />}>
      <PublicRoutes />
    </React.Suspense>
  );
};
const Index = () => {
  return (
    <React.Fragment>
      <UsersSettings />
      <RefreshToken />
      <React.Suspense fallback={<Loading loading={true} />}>
        <Switch>
          <Route path={guestRoutes} exact>
            <GuestRoutesWrapper />
          </Route>
          <Route path={privateRoutes} exact>
            <PrivateRoutesWrapper />
          </Route>
          <Route path={'/:username'}>
            <PublicPageWrapper />
          </Route>
        </Switch>
      </React.Suspense>
    </React.Fragment>
  );
};

export default Index;
