import PageTransition from 'layout/page-transition';
import PublicUser from 'layout/publicUser';
import Purchase from 'layout/purchase';
import PublicProfile from 'pages/[username]';
import PublicServices from 'pages/[username]/[popslug]';
import AddCardAndCheckout from 'pages/purchase/add-a-card-and-checkout';
import Congratulations from 'pages/purchase/congratulations';
import Phoneverification from 'pages/purchase/phone-verification';
import PhoneNumber from 'pages/purchase/phonenumber';
import SetPassword from 'pages/purchase/set-password';
import RcAnimatePresence from './components/RcAnimatePresence';
import RcRoute from './components/RcRoute';
import RcSwitch from './components/RcSwitch';

const purchaseRoutes = [
  {
    path: '/:username/purchase/add-a-card-and-checkout',
    name: 'add-a-card-and-checkout',
    Component: AddCardAndCheckout,
    exact: true,
  },
  {
    path: '/:username/purchase/congratulations',
    name: 'pop',
    Component: Congratulations,
    exact: true,
  },
  {
    path: '/:username/purchase/set-phone',
    name: 'pop',
    Component: PhoneNumber,
    exact: true,
    layoutProps: { showHeader: false, showHeaderMenu: false },
  },
  {
    path: '/:username/purchase/verify-phone',
    name: 'pop',
    Component: Phoneverification,
    exact: true,
  },
  {
    path: '/:username/purchase/set-password',
    name: 'pop',
    Component: SetPassword,
    exact: true,
  },
];

function App() {
  return (
    <RcSwitch>
      {/* <PublicUser showFooter={true} hideTopFooter={true}>
         <RcAnimatePresence> */}
      <RcRoute path={`/:username`} exact>
        <PublicUser showFooter={true} hideTopFooter={true}>
          <RcAnimatePresence>
            <PageTransition>
              <PublicProfile />
            </PageTransition>
          </RcAnimatePresence>
        </PublicUser>
      </RcRoute>
      <RcRoute path="/:username/purchase">
        <PageTransition>
          <RcSwitch>
            {purchaseRoutes.map((route) => (
              <RcRoute
                key={route.path}
                path={route.path}
                layoutProps={route?.layoutProps}
                exact
              >
                <PublicUser
                  layoutProps={route?.layoutProps}
                  showFooter={true}
                  hideTopFooter={true}
                >
                  <RcAnimatePresence>
                    <Purchase>
                      <route.Component />
                    </Purchase>
                  </RcAnimatePresence>
                </PublicUser>
              </RcRoute>
            ))}
          </RcSwitch>
        </PageTransition>
      </RcRoute>
      <RcRoute path={`/:username/:popslug`} exact>
        <PublicUser showFooter={true} hideTopFooter={true}>
          <RcAnimatePresence>
            <PageTransition>
              <PublicServices />
            </PageTransition>
          </RcAnimatePresence>
        </PublicUser>
      </RcRoute>
      {/* </RcAnimatePresence>
      </PublicUser> */}
    </RcSwitch>
  );
}

export default App;
