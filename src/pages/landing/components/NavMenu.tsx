import Button from 'components/NButton';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Routes } from './Header';
type IMenuItems = {
  className?: string;
  isMenuOpen?: boolean;
  routes: typeof Routes;
  setIsMenueOpen?: (isTrue: any) => boolean;
};
type IMenuItem = {
  className?: string;
  route: typeof Routes[0];
};
// const variants = {
//   initial: {
//     top: '0px',
//     position: 'absolute',
//   },
//   animate: {
//     top: '30px',
//   },
//   exit: {
//     top: '0px',
//     position: 'absolute',
//   },
// };
const NavItem = (props: IMenuItem) => {
  const { route, className } = props;
  const { title, path, hasChilds } = route;
  const history = useHistory();
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onClick={() => {
        if (hasChilds) {
          setIsActive(!isActive);
          return;
        }
        history.push(path);
      }}
      className={`navitem ${className}`}
    >
      <span className="button color-red topnav s-button">{title}</span>
      {/* {hasChilds ? <ArrowDown /> : null}
      {hasChilds ? (
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="mobile-menu-block"
              key="right"
              custom={'right'}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants as any}
              style={{ width: '100%', position: 'absolute' }}
              transition={{ mass: 0.2, duration: 0.3 }}
            >
              <div className={`submenu ${isActive ? 'active' : ''}`}>
                {children?.map((route, index) => {
                  return <NavItem route={route} key={index} />;
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : null} */}
    </div>
  );
};
const NavItemWrapper = styled(NavItem)`
  cursor: pointer;

  position: relative;
  .submenu {
    display: none;
  }
  .submenu.active {
    display: block;
  }
`;
const NavItems = (props: IMenuItems) => {
  const { className, routes, setIsMenueOpen, isMenuOpen } = props;
  const history = useHistory();
  return (
    <div className={`site_menu_items ${className}`}>
      <nav
        role="navigation"
        id="w-node-b2052354-5446-da9c-e906-f9d98118b8b3-8118b8ae"
        className="nav-menu s-nav-menu"
      >
        <div className="">
          <div className="site-menu-items-wrapper">
            {routes.map((route) => {
              return <NavItemWrapper route={route} key={route.path} />;
            })}
            <div>
              <Button
                size="large"
                type="primary"
                onClick={() => history.push('/signup')}
              >
                START HERE
              </Button>
              <div
                className={`mobile-menu-opener ${
                  isMenuOpen ? 'landing-mobile-active' : ''
                }`}
                onClick={() =>
                  setIsMenueOpen?.((prev: boolean) => !prev as boolean)
                }
              ></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default styled(NavItems)`
  width: 100%;
  .site-menu-items-wrapper {
    display: flex;
    align-items: center;
  }
`;
