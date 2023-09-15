import classNames from 'classnames';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from 'theme/logo';

type Props = {
  className?: string;
  setIsMenuOpen?: (isTrue: any) => void;
};
export const Routes = [
  {
    path: '/features',
    id: 'features',
    isActive: false,
    title: 'Features',
    hasChilds: false,
  },
  {
    path: '/users',
    id: 'users',
    isActive: false,
    title: 'Users',
    hasChilds: false,
  },
  {
    path: '/success',
    id: 'success',
    isActive: false,
    title: 'Success',
    hasChilds: false,
  },
  {
    path: '/get-started',
    id: 'get-started',
    isActive: false,
    title: 'Get Started',
    hasChilds: false,
  },
  // { path: '/Support', isActive: false, title: 'Support', hasChilds: false },
  // {
  //   path: '/Pages',
  //   isActive: false,
  //   title: 'Pages',
  //   hasChilds: true,

  //   children: [
  //     { path: '/contact', isActive: false, title: 'Contact', hasChilds: false },
  //     { path: '/press', isActive: false, title: 'Press', hasChilds: false },
  //     {
  //       path: '/licensing',
  //       isActive: false,
  //       id: 'licensing',
  //       title: 'Licensing',
  //       hasChilds: false,
  //     },
  //     {
  //       path: '/changeLog',
  //       isActive: false,
  //       id: 'changeLog',
  //       title: 'ChangeLog',
  //       hasChilds: false,
  //     },
  //     {
  //       id: 'style-guide',
  //       path: '/style-guide',
  //       isActive: false,
  //       title: 'Style Guide',
  //       hasChilds: false,
  //     },
  //   ],
  // },
];
const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
const Header = (props: Props) => {
  const { className, setIsMenuOpen } = props;
  const controls = useAnimation();
  const ref = useRef<any>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.8, delay: 0.2 }}
      variants={variants}
      className={classNames([className, 'sp-header'])}
    >
      <div className="sp-container">
        <strong className="sp-logo">
          <Link to="/">
            <Logo />
          </Link>
        </strong>
        <div className="sp-nav-drop">
          <div className="sp-nav-drop-holder">
            {/* <ul className="sp-main-nav">
              {Routes.map((route) => {
                // if (!route.hasChilds) {
                return (
                  <li key={route.title}>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (route.id) {
                          scrollIntoView(
                            document.getElementById(route.id) as HTMLElement,
                            {
                              behavior: 'smooth',
                              block: 'center',
                              inline: 'center',
                            },
                          );
                          // document.getElementById(route.id)?.scrollIntoView({
                          //   behavior: 'smooth',
                          // });
                        }
                      }}
                    >
                      {route.title}
                    </Link>
                  </li>
                );
                // }
                // return (
                //   <li className="sp-has-dropdown" key={route.path}>
                //     <a
                //       href="#"
                //       onClick={(e) => {
                //         e.stopPropagation();
                //         e.preventDefault();
                //       }}
                //     >
                //       {route.title}
                //     </a>

                //     {<ul className="sp-dropdown-menu">
                //       {route.children?.map((route) => {
                //         return (
                //           <li key={route.title}>
                //             <Link
                //               to={''}
                //               onClick={(e) => {
                //                 e.preventDefault();
                //                 e.stopPropagation();
                //                 if (route.id) {
                //                   document
                //                     .getElementById(route.id)
                //                     ?.scrollIntoView({
                //                       behavior: 'smooth',
                //                     });
                //                 }
                //               }}
                //             >
                //               {route.title}
                //             </Link>
                //           </li>
                //         );
                //       })}
                //     </ul> }
                //   </li>
                // );
              })}
            </ul> */}
            <div className="sp-header-cta">
              <Link to={'/signup'} className="sp-button">
                START HERE
              </Link>
              <Link to={'/login'} className="sp-button sp_login">
                LOGIN
              </Link>
            </div>
          </div>
        </div>
        <div
          onClick={() => setIsMenuOpen?.((prev: boolean) => !prev)}
          className="sp-nav-opener"
        >
          <img
            src="/assets/images/landing-page/menu-icon-white.svg"
            alt="menu icon"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default styled(Header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  height: 75px;
  display: flex;
  align-content: center;
  background: var(--pallete-background-default);
  /* box-shadow: 0 1px 0 0 #f1f1f1; */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  .sp-container {
    display: flex;
    align-items: center;

    @media (max-width: 991px) {
      justify-content: space-between;
    }
  }

  .sp-logo {
    display: block;
    margin: 0 30px 0 0;

    a {
      display: block;
    }

    img,
    svg {
      display: block;
      height: 50px;
      width: auto;

      @media (max-width: 991px) {
        height: 40px;
      }

      @media (max-width: 374px) {
        height: 34px;
      }

      path {
        opacity: 1 !important;
      }
    }
  }

  .sp-nav-opener {
    position: relative;
    left: auto;
    top: 0;
    right: 0;
    bottom: auto;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 45px;
    margin-left: 15px;
    padding: 9px 15px 10px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background-image: linear-gradient(135deg, #fa5853, #f46692 49%, #ffc444);
    transition: background-color 200ms ease;
    line-height: 1;
    text-align: center;
    display: none;

    @media (max-width: 991px) {
      //display: flex;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
      position: relative;
      top: 1px;
    }
  }

  .sp-nav-drop {
    flex-grow: 1;
    flex-basis: 0;

    /* @media (max-width: 991px) {
      position: absolute;
      left: 0;
      top: 100%;
      width: 100%;
      flex-grow: inherit;
      flex-basis: auto;
      max-height: 0;
      overflow: hidden;
      transition: all 0.25s linear;
      background: var(--pallete-background-default);
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.05);
    }

    .nav-active & {
      @media (max-width: 991px) {
        max-height: 4000px;
      }
    }*/

    .sp-nav-drop-holder {
      display: flex;
      align-items: center;

      /*@media (max-width: 991px) {
        transition: all 0.25s linear;
        transform: translateY(-100%);
        padding: 18px 0;
        display: block;
      }

      .nav-active & {
        @media (max-width: 991px) {
          transform: translateY(0);
        }
      }*/
    }
  }

  .sp-main-nav {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1.2;

    /*@media (max-width: 991px) {
      display: block;
      overflow: hidden;
      margin: 0 0 10px;
    }*/

    li {
      position: relative;

      /*@media (max-width: 991px) {
        margin: 0 0 8px;
      }*/

      a {
        display: block;
        color: var(--pallete-background-black);
        padding: 10px 16px;
        text-decoration: none;
        opacity: 0.8;

        /*@media (max-width: 991px) {
          font-weight: 600;
        }*/
      }

      &:hover {
        > a {
          opacity: 1;
        }
      }

      &.sp-has-dropdown {
        > a {
          padding-right: 40px;
        }

        &:after {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 16px;
          width: 20px;
          height: 20px;
          content: '';
          background: url('/assets/images/landing-page/down-icon.svg') no-repeat;
          background-size: 100% 100%;
          opacity: 0.8;
          pointer-events: none;

          @media (max-width: 991px) {
            transform: none;
            top: 10px;
          }
        }

        &:hover {
          &:after {
            opacity: 1;
          }

          .sp-dropdown-menu {
            opacity: 1;
            visibility: visible;

            @media (max-width: 991px) {
              display: block;
            }
          }
        }
      }
    }
  }

  .sp-dropdown-menu {
    list-style: none;
    padding: 10px 0;
    margin: 0;
    width: 180px;
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 17px;
    background: var(--pallete-background-default);
    border-radius: 0 0 3px 3px;
    box-shadow: 0 4px 4px 2px rgba(0, 0, 0, 0.06);
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-in-out;

    @media (max-width: 991px) {
      position: static;
      opacity: 1;
      visibility: visible;
      display: none;
      background: #f5f5f5;
      padding: 10px 0px;
      width: 100%;
      margin-top: 0;
      box-shadow: none;
    }

    &:before {
      position: absolute;
      left: 0;
      bottom: 100%;
      width: 100%;
      height: 17px;
      background: transparent;
      content: '';

      @media (max-width: 991px) {
        display: none;
      }
    }
  }

  .sp-header-cta {
    margin-left: auto;

    /*@media (max-width: 991px) {
      width: 100%;
      padding: 0 18px;
    }*/

    .sp-button {
      @media (max-width: 991px) {
        min-width: 160px;
      }

      @media (max-width: 479px) {
        min-width: inherit;
        font-size: 12px;
        line-height: 15px;
        padding: 10px;
      }

      @media (max-width: 374px) {
        padding: 10px 14px;
      }
    }
  }
`;
