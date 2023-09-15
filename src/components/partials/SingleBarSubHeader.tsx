import useAuth from 'hooks/useAuth';
import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import 'styles/dropdown.css';
import 'styles/navigation.css';

const SubNav: React.FC<{ items?: any[] }> = ({ items }) => {
  return (
    <div className="sub-items-holder">
      <ul className="navbar-sub-menu">
        {items?.map(
          ({ url, id, name, icon, isHidden, ...rest }, index: number) =>
            isHidden ? null : (
              <li key={index} id={id} className="navbar-sub-menu__item">
                <NavLink
                  to={url}
                  className="navbar-sub-menu__link"
                  activeClassName="is-active"
                  {...rest}
                >
                  {icon}
                  {name}
                </NavLink>
              </li>
            ),
        )}
      </ul>
    </div>
  );
};

const SingleBarSubHeader = () => {
  const { user } = useAuth();
  return (
    <Switch>
      <Route
        exact
        path={[
          '/account/social-accounts',
          '/account/billing',
          '/account/payments/withdraw',
          '/account/payments',
          '/account',
        ]}
      >
        <SubNav
          items={[
            {
              name: 'Settings',
              url: '/account',
              exact: true,
            },
            {
              name: 'Billing',
              url: '/account/billing',
              exact: true,
              isHidden: !user.showPurchaseMenu,
            },
            {
              name: 'Wallet',
              url: '/account/payments',
              exact: true,
            },
            {
              name: 'Social Accounts',
              url: '/account/social-accounts',
              exact: true,
            },
          ]}
        />
      </Route>
    </Switch>
  );
};
export default SingleBarSubHeader;
