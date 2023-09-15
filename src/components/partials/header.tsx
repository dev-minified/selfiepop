import {
  DubbleGallery,
  MyProfileSideMenuIcon,
  RequestIcon,
  SalespurchasesChat,
  StarEmpty,
  VideoCameraSvg,
} from 'assets/svgs';

import classNames from 'classnames';
import Scrollbar from 'components/Scrollbar';
import useAuth from 'hooks/useAuth';
import useBottomNavToggler from 'hooks/useBottomnavToggle';
import { memo, useEffect, useState } from 'react';
import { UnmountClosed } from 'react-collapse';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/dropdown.css';
import 'styles/navigation.css';
import swal from 'sweetalert';
import Logo from 'theme/logo';
import AvatarDropDown from './components/AvatarDropDown';
export const Header = styled.header<any>`
  width: 100%;
  padding: 15px 3px;
  background: #000;
  position: relative;
  z-index: 12;

  .counter {
    display: inline-block;
    vertical-align: middle;
    min-width: 21px;
    text-align: center;
    color: #fff;
    background: #7ccf78;
    border-radius: 4px;
    font-size: 14px;
    line-height: 17px;
    padding: 2px 3px;
    margin: 0 0 0 5px;
    display: none;

    @media (max-width: 1023px) {
      font-size: 10px;
      line-height: 12px;
      padding: 2px;
    }

    &.bg-blue {
      background: var(--pallete-primary-main);
    }
  }
  .counter.show {
    display: inline-block;
  }
  .dropdown-menu {
    right: 0px;
    left: auto;
  }

  @media (max-width: 767px) {
    padding: 15px 0;
    z-index: 11;
    margin: 0;
  }

  .logo {
    width: 126px;

    @media (max-width: 1199px) {
      width: 100px;
    }

    @media (max-width: 1023px) {
      width: 80px;
    }

    a {
      display: flex;
      align-items: center;
      font-size: 11px;
      line-height: 14px;
      font-weight: 400;
      color: var(--pallete-primary-main);

      svg {
        width: 100%;
        max-width: 126px;
        display: block;
      }
    }

    .text-beta {
      margin: 2px 0 0 -2px;
    }
  }
`;

export default function Index(props: any) {
  const { showHeaderMenu = true, removeOnMobile = true } = props;
  const [show, setshow] = useState<boolean>(false);
  const user = useAuth()?.user;
  const Logout = useAuth()?.Logout;
  const location = useLocation();
  const { pathname } = location;
  const handleLogout = () => {
    swal({
      title: 'Log Out',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Logout'],
    }).then(async (willLogout) => {
      if (willLogout) {
        Logout();
      }
    });
  };

  useEffect(() => {
    window.onresize = () => {
      if (window.screen.width < 767) {
        if (!show) return;
        return setshow(true);
      }
      return setshow(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const showmembers =
    user?.enableMembershipFunctionality && !user?.skipOnBoarding;
  const Menu = memo(() => {
    const showNav = useBottomNavToggler()?.showNav;
    return showNav ? (
      <Scrollbar className="custom-scroll-bar" style={{ overflowY: 'hidden' }}>
        <ul className="navbar-nav site_main_nav">
          <li className="nav-item">
            <NavLink
              activeClassName="is-active"
              to="/new-feeds"
              className="nav-link"
            >
              <span className="menu-icon">
                <StarEmpty width={'20px'} height={'20px'} />
              </span>
              <span className="menu-text">Home</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              activeClassName="is-active"
              to="/messages"
              className="nav-link"
            >
              <span className="menu-icon">
                <SalespurchasesChat
                  color="currentColor"
                  width="18px"
                  height="18px"
                />
              </span>
              <span className="menu-text">Messages</span>
            </NavLink>
          </li>
          {showmembers && (
            <li className="nav-item">
              <NavLink
                activeClassName="is-active"
                to="/my-members"
                className="nav-link"
              >
                <span className="menu-icon">
                  <VideoCameraSvg />
                </span>
                <span className="menu-text"> Creator</span>
              </NavLink>
            </li>
          )}
          {!removeOnMobile && (
            <li className="nav-item">
              <NavLink
                activeClassName="is-active"
                to="/my-profile"
                className="nav-link"
              >
                <span className="menu-icon">
                  <MyProfileSideMenuIcon />
                </span>
                <span className="menu-text">
                  <span className="hide-mobile">Link </span>In Bio
                </span>
              </NavLink>
            </li>
          )}

          <li className="nav-item">
            <NavLink
              activeClassName="is-active"
              to="/orders"
              className="nav-link"
              exact={false}
            >
              <span className="menu-icon">
                <RequestIcon width="18px" height="18px" />
              </span>
              <span className="menu-text">Orders</span>
            </NavLink>
          </li>

          {/* {user?.showSellerMenu && user?.idIsVerified && (
            <li className="nav-item">
              <NavLink
                activeClassName="is-active"
                to="/orders/my-sales"
                className="nav-link"
                exact
              >
                <span className="menu-icon">
                  <RequestIcon />
                </span>
                <span className="menu-text">Orders</span>
              </NavLink>
            </li>
          )} */}
          <li className="nav-item">
            <NavLink
              activeClassName="is-active"
              to="/vault"
              className="nav-link"
              exact
            >
              <span className="menu-icon">
                <DubbleGallery fill="currentColor" />
              </span>
              <span className="menu-text">Vault</span>
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <ThemeSwither />
          </li> */}
        </ul>
      </Scrollbar>
    ) : null;
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const rootelem: any = document.getElementById('root');
    if (!showHeaderMenu) {
      if (!rootelem?.classList.contains('isactive-sub_menu')) {
        rootelem.classList.add('isactive-sub_menu');
      }
    } else {
      if (rootelem?.classList.contains('isactive-sub_menu')) {
        rootelem.classList.remove('isactive-sub_menu');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!props.user) {
    return <div />;
  }

  return (
    <Header id="header">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <strong className="logo">
          <Link
            to={showHeaderMenu ? '/my-profile' : '#'}
            id={'sp_test_id_header_logo'}
          >
            <Logo />
          </Link>
        </strong>
        {showHeaderMenu && (
          <>
            <nav className="navbar navbar-expand-md flex-grow-1">
              <button
                className={classNames('navbar-toggler ml-auto', {
                  isActive: show,
                })}
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={() => setshow((state: Boolean) => !state)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <Menu />
                <div className="user-login-box ml-md-auto user-loggedin">
                  <AvatarDropDown
                    user={props.user}
                    handleLogout={handleLogout}
                  />
                </div>
              </div>
              <UnmountClosed
                isOpened={show}
                theme={{
                  collapse: 'ReactCollapse--collapse  navbar-collapse',
                  content: 'ReactCollapse--content custom-collapse-nav-content',
                }}
                style={{ position: 'absolute' }}
              >
                <div className="user-login-box ml-md-auto user-loggedin">
                  <AvatarDropDown
                    user={props.user}
                    handleLogout={handleLogout}
                    alwaysOpen={true}
                  />
                </div>
              </UnmountClosed>
            </nav>
          </>
        )}{' '}
      </div>
    </Header>
  );
}
