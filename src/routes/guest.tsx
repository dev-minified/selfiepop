import Loading from 'components/SiteLoader';
import TikTokPlayer from 'components/TiktokPlayer';
import PageTransition from 'layout/page-transition';
import Invite from 'pages/QRCode/liveevent/Invite';
import InviteSuccess from 'pages/QRCode/liveevent/Success';
// import PunchTicket from 'pages/PunchTicket';
import React, { Fragment, ReactElement } from 'react';
import { Route, RouteProps, useParams } from 'react-router';
import { Redirect, Switch } from 'react-router-dom';

const Page404 = React.lazy(() => import('pages/404'));
const GuestLayout = React.lazy(() => import('layout/guest'));
const PublicVideoLayout = React.lazy(() => import('layout/PublicVideoLayout'));
const SinglePanelLayout = React.lazy(() => import('layout/SinglePanelLayout'));

const PublicVideo = React.lazy(() => import('pages/account/public-video'));
const ActivateAccount = React.lazy(() => import('pages/activate-account'));
const ProfileUnavailable = React.lazy(
  () => import('pages/profile-unavailable'),
);
const EmailVerify = React.lazy(() => import('pages/verify-email'));
const RecoverPassword = React.lazy(() => import('pages/recover-password'));
const ResetPassword = React.lazy(() => import('pages/reset-password'));
const ResetPasswordRecoveryLink = React.lazy(
  () => import('pages/reset-password-recovery-link'),
);

const Home = React.lazy(() => import('pages/index'));
const SignUp = React.lazy(() => import('pages/signup'));
const Terms = React.lazy(() => import('pages/terms'));
const Policy = React.lazy(() => import('pages/policy'));

const Login = React.lazy(() => import('pages/login'));
const Logout = React.lazy(() => import('pages/logout'));
const SetPassword = React.lazy(() => import('pages/Set-password'));
const LiveEvent = React.lazy(() => import('pages/QRCode/liveevent/LiveEvent'));
const StreepPromo = React.lazy(
  () => import('pages/QRCode/QRalternative/Streetpromo'),
);

export const EmptyLayout: React.FC = ({ children, ...rest }: any) => {
  return (
    <Fragment>{React.cloneElement(children as ReactElement, rest)}</Fragment>
  );
};

export interface IRoutes extends Partial<RouteProps> {
  name?: string;
  Component: any;
  RouteComponent?: React.ElementType;
  Layout?: React.ElementType;
  layoutProps?: { [key: string]: any };
  isTransition?: boolean;
}

const RedirectToSign = () => {
  const { username } = useParams<{ username: string }>();
  return <Redirect to={`/signup/${username}`} />;
};

const routes: IRoutes[] = [
  {
    name: 'Home',
    path: '/',
    Component: Home,
    exact: true,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    Component: () => <Redirect to="/my-profile" />,
    exact: true,
  },
  {
    name: 'login',
    path: '/login',
    Component: Login,
    Layout: GuestLayout,
    exact: true,
  },
  {
    path: '/ticktok',
    name: 'ticktok',
    Component: TikTokPlayer,
    exact: true,
  },
  {
    name: 'liveevent',
    path: '/liveevent',
    Component: LiveEvent,
    Layout: GuestLayout,
    exact: true,
  },
  {
    name: 'streetpromo',
    path: '/streetpromo',
    Component: StreepPromo,
    Layout: GuestLayout,
    exact: true,
  },
  {
    name: 'viewinvite',
    path: '/viewinvite',
    Component: Invite,
    Layout: GuestLayout,
    exact: true,
  },
  {
    name: 'inviteSuccess',
    path: '/invite-success',
    Component: InviteSuccess,
    Layout: GuestLayout,
    exact: true,
    isTransition: true,
    layoutProps: {
      showdashboardbtn: true,
    },
  },
  // {
  //   name: 'punchticket',
  //   path: '/punchticket',
  //   Component: PunchTicket,
  //   Layout: GuestLayout,
  //   exact: true,
  // },
  {
    name: 'Logout',
    path: '/logout',
    Component: Logout,
    Layout: GuestLayout,
    exact: true,
  },
  {
    name: 'Verify Email',
    path: '/verify-email',
    Component: EmailVerify,
    exact: true,
  },
  {
    name: 'Reset Password',
    path: '/reset-password',
    Component: ResetPassword,
    exact: true,
  },
  {
    name: 'Activate Account',
    path: '/activate-account',
    Component: ActivateAccount,
    exact: true,
  },
  {
    name: 'Reover Password',
    path: '/reset-password-recovery-link',
    Component: ResetPasswordRecoveryLink,
    exact: true,
  },
  {
    name: 'Terms',
    path: '/terms',
    Component: Terms,
    exact: true,
  },
  {
    name: 'Policy',
    path: '/policy',
    Component: Policy,
    exact: true,
  },
  {
    name: 'Recover Password',
    path: '/recover-password',
    Component: RecoverPassword,
    exact: true,
  },
  {
    name: 'signup',
    path: '/signup',
    Component: SignUp,
    Layout: GuestLayout,
    exact: true,
  },
  // {
  //   name: 'signup',
  //   path: '/v2/signup/:hash',
  //   Component: SignUp,
  //   Layout: GuestLayout,
  //   exact: true,
  // },
  {
    name: 'signup',
    path: '/signup/:refId',
    Component: SignUp,
    Layout: GuestLayout,
    exact: true,
  },
  {
    name: '404',
    path: '/404',
    Component: Page404,
    exact: true,
  },
  {
    name: 'set-password',
    path: '/set-password',
    Component: SetPassword,
    exact: true,
  },
  {
    name: 'profile-unavailable',
    path: '/profile-unavailable',
    Component: ProfileUnavailable,
    exact: true,
  },
];

export const RoutesArray: string[] = routes
  .map((r) => r.path as string)
  .concat(['/shoutout/view/:orderId', '/innercircle/:username']);

export default function Routes(): ReactElement {
  return (
    <React.Suspense fallback={<Loading loading={true} />}>
      <Switch>
        {routes.map((route, index: number) => {
          const {
            Component,
            Layout,
            RouteComponent,
            name,
            path,
            exact,
            layoutProps,
            isTransition = false,
          } = route;
          const CLayout = Layout || EmptyLayout;
          const CRoute = RouteComponent || Route;
          return (
            <CRoute key={index} name={name} path={path} exact={exact}>
              {isTransition ? (
                <PageTransition>
                  <CLayout key={path} {...layoutProps}>
                    <Component />
                  </CLayout>
                </PageTransition>
              ) : (
                <CLayout key={path} {...layoutProps}>
                  <Component />
                </CLayout>
              )}
            </CRoute>
          );
        })}
        <Route path="/shoutout/view/:orderId" exact>
          <PublicVideoLayout>
            <SinglePanelLayout>
              <PublicVideo />
            </SinglePanelLayout>
          </PublicVideoLayout>
        </Route>
        <Route path="/innercircle/:username" exact>
          <RedirectToSign />
        </Route>
      </Switch>
    </React.Suspense>
  );
}
