import Loading from 'components/SiteLoader';
import PrivateLayout from 'layout/PrivateLayout';
import SelfiePopLayout from 'layout/selfie-pop';
import React, { cloneElement } from 'react';
import { Route, RouteProps } from 'react-router';
const RcRoute: React.FC<
  { privateFC?: boolean; layoutProps?: any } & RouteProps
> = ({ children, layoutProps, privateFC, exact, path, ...rest }: any) => {
  if (privateFC)
    return (
      <Route exact={exact} path={path} key={path} {...rest}>
        <PrivateLayout {...layoutProps}>
          <SelfiePopLayout {...layoutProps}>
            <React.Suspense fallback={<Loading loading />}>
              {cloneElement(children, { ...rest })}
            </React.Suspense>
          </SelfiePopLayout>
        </PrivateLayout>
      </Route>
    );
  return (
    <Route exact={exact} path={path} key={path} {...rest}>
      {cloneElement(children, { ...rest })}
    </Route>
  );
};

export default RcRoute;
