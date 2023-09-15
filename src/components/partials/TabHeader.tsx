import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const tabls: { [key: string]: string } = {
  myLinks: 'mylinks',
  appearance: 'appearance',
  account: 'account',
  analytics: 'analytics',
};

const HeaderAlt = styled.header`
  position: relative;
  background: #d5dade;

  .header-alt__menu-wrap {
    position: relative;
    padding: 5px 0 0;
  }

  .header-alt__img-avatar {
    position: absolute;
    width: 56px;
  }

  .header-alt__avatar-link {
    background: #edeff1;
    border-radius: 8px 8px 0 0;
    display: block;
    padding: 6px 4px 3px;
  }

  .header-alt__avatar-link img {
    width: 36px;
    height: 36px;
    border-radius: 100%;
    display: block;
    margin: 0 auto;
  }

  .header-alt__avatar-link:hover {
    background: var(--pallete-background-default);
    color: rgba(0, 0, 0, 0.58);
  }

  @media (max-width: 767px) {
    background: var(--pallete-background-default);

    .header-alt__menu-wrap {
      padding: 5px 10px;
    }

    .header-alt__img-avatar {
      position: static;
      width: 36px;
    }

    .header-alt__avatar-link {
      background: transparent;
      padding: 0;
      margin: 0;
    }
  }
`;

const NavDrop = styled.div`
  .navdrop {
    padding: 0 0 0 57px;
  }

  .navdrop-opener,
  .navdrop-close {
    display: none;
  }

  @media (max-width: 767px) {
    .navdrop {
      position: absolute;
      right: 10px;
      top: 50%;
      width: 32px;
      height: 32px;
      padding: 0;
      margin-top: -16px;
    }
    .navdrop-opener {
      width: 100%;
      height: 100%;
      position: relative;
      display: block;
      opacity: 0.7;
    }
    .navdrop-opener:before,
    .navdrop-opener:after,
    .navdrop-opener span {
      width: 22px;
      height: 2px;
      background: #000;
      position: absolute;
      left: 50%;
      content: '';
      border-radius: 2px;
      transform: translateX(-50%);
    }
    .navdrop-opener:before {
      top: 9px;
    }
    .navdrop-opener:after {
      bottom: 9px;
    }
    .navdrop-opener span {
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .navdrop-close {
      width: 40px;
      height: 40px;
      position: relative;
      display: block;
    }
    .navdrop-close:before,
    .navdrop-close:after {
      width: 22px;
      height: 2px;
      background: #000;
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -1px 0 0 -11px;
      content: '';
      border-radius: 2px;
    }
    .navdrop-close:before {
      transform: rotate(45deg);
    }
    .navdrop-close:after {
      transform: rotate(-45deg);
    }
    .navdrop-holder {
      position: fixed;
      right: -300px;
      top: 0;
      z-index: 5;
      width: 270px;
      height: 100vh;
      overflow: auto;
      background: var(--pallete-background-default);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
      transition: right 0.25s ease-in-out;
    }
  }
`;

const MainMenu = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  .main-menu__item {
    padding: 0 0 0 1px;
  }
  .main-menu__link {
    display: block;
    padding: 14px 20px 13px;
    background: #edeff1;
    border-radius: 8px 8px 0 0;
    color: rgba(0, 0, 0, 0.58);
    position: relative;
  }
  .main-menu__link:after {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    background: var(--pallete-background-default);
    content: '';
    height: 1px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
  }
  .main-menu__link:hover,
  .main-menu__item.active .main-menu__link {
    background: var(--pallete-background-default);
    color: rgba(0, 0, 0, 0.58);
  }
  .main-menu__item.active .main-menu__link:after {
    opacity: 1;
    visibility: visible;
  }
  .sub-menu-holder {
    margin: 5px 0 0;
    padding: 17px 10px 17px 3px;
    list-style: none;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 100%;
    display: flex;
    flex-direction: row;
    font-size: 15px;
    line-height: 18px;
  }
  .sub-menu-holder__item {
    padding: 0 20px;
    position: relative;
  }
  .sub-menu-holder__item:before {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    content: '';
    background: #d5dade;
    height: 25px;
    width: 1px;
  }
  .sub-menu-holder__item:first-child:before {
    display: none;
  }
  .sub-menu-holder__link {
    color: #72777d;
  }
  .main-menu__item.active .sub-menu-holder {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 767px) {
    display: block;
    padding: 20px 0;
    .main-menu__link {
      background: var(--pallete-background-default);
      border-radius: 0;
    }
    .main-menu__link:hover {
      background: var(--pallete-text-lighter-300);
    }
    .main-menu__item.active .main-menu__link {
      background: var(--pallete-text-lighter-300);
    }
    .sub-menu-holder {
      position: static;
      display: none;
      opacity: 1;
      visibility: visible;
      padding: 5px 0;
    }
    .sub-menu-holder__item {
      padding: 0;
    }
    .sub-menu-holder__item:before {
      display: none;
    }
    .sub-menu-holder__link {
      display: block;
      padding: 8px 30px;
    }
    .main-menu__item.active .sub-menu-holder {
      display: block;
    }
  }
`;

const HeaderLinkArea = styled.div`
  background: var(--pallete-background-default);
  border-top: 1px solid var(--pallete-colors-border);
  border-bottom: 1px solid var(--pallete-colors-border);
  padding-top: 12px;
  padding-bottom: 12px;
  margin-bottom: 0;

  .header-link-area .btn-round {
    border-radius: 4px;
    font-size: 12px;
    line-height: 15px;
    min-width: 58px;
    padding: 4px 6px 3px;
  }
  .header-link-area__link-holder {
    font-size: 13px;
    line-height: 15px;
    font-weight: 500;
    color: var(--pallete-text-main-50);
    position: relative;
    padding: 0 10px 0 30px;
  }
  .header-link-area__link-holder .icon-star1 {
    position: absolute;
    left: 0;
    top: -2px;
    font-size: 20px;
  }
  .header-link-area__link {
    color: var(--pallete-primary-main);
  }
  @media (max-width: 991px) {
    .header-link-area__link-holder {
      margin: 0 -10px;
    }
  }

  @media (max-width: 767px) {
    padding-top: 9px;
    padding-bottom: 9px;
    .header-link-area__link-holder {
      font-size: 12px;
      margin: 0 -5px;
      padding: 0 10px 0 20px;
    }
    .header-link-area__link-holder .icon-star1 {
      font-size: 14px;
      top: 1px;
    }
    .header-link-area .btn.btn-round {
      min-width: 58px;
      font-size: 12px;
      text-transform: capitalize;
      margin-right: -5px;
    }
  }
`;

export default function TabHeader(): ReactElement {
  const [activeTab, setActiveTab] = useState<string>(tabls.myLinks);
  return (
    <HeaderAlt className="header-alt">
      <div className="header-alt__menu-wrap">
        <div className="header-alt__img-avatar">
          <Link to="/" className="header-alt__avatar-link">
            <img src="/assets/images/img-user01.jpg" alt="img description" />
          </Link>
        </div>
        <NavDrop className="navdrop">
          <span className="navdrop-opener">
            <span></span>
          </span>
          <div className="navdrop-holder">
            <span className="navdrop-close"></span>
            <MainMenu className="main-menu">
              <li
                className={`main-menu__item ${
                  tabls.myLinks === activeTab && 'active'
                }`}
                onClick={() => setActiveTab(tabls.myLinks)}
              >
                <Link to="/" className="main-menu__link">
                  My Links
                </Link>
                <ul className="sub-menu-holder">
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      My Links 1
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      My Links 2
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      My Links 3
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      My Links 4
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                className={`main-menu__item ${
                  tabls.appearance === activeTab && 'active'
                }`}
                onClick={() => setActiveTab(tabls.appearance)}
              >
                <Link to="/" className="main-menu__link">
                  Appearance
                </Link>
                <ul className="sub-menu-holder">
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Appearance 1
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Appearance 2
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Appearance 3
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Appearance 4
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                className={`main-menu__item ${
                  tabls.account === activeTab && 'active'
                }`}
                onClick={() => setActiveTab(tabls.account)}
              >
                <Link to="/" className="main-menu__link">
                  Account
                </Link>
                <ul className="sub-menu-holder">
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Sales
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Purchases
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Wallet
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Billing
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                className={`main-menu__item ${
                  tabls.analytics === activeTab && 'active'
                }`}
                onClick={() => setActiveTab(tabls.analytics)}
              >
                <Link to="/" className="main-menu__link">
                  Analytics
                </Link>
                <ul className="sub-menu-holder">
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Analytics 1
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Analytics 2
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Analytics 3
                    </Link>
                  </li>
                  <li className="sub-menu-holder__item">
                    <Link to="/" className="sub-menu-holder__link">
                      Analytics 4
                    </Link>
                  </li>
                </ul>
              </li>
            </MainMenu>
          </div>
        </NavDrop>
      </div>
      <HeaderLinkArea className="header-link-area container-fluid">
        <div className="row justify-content-end">
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-between align-items-center">
              <div className="header-link-area__link-holder">
                <i className="icon-star1"></i>My Selfie Pop:{' '}
                <Link to="/" className="header-link-area__link">
                  www.selfiepop.com/katieplum
                </Link>
              </div>
              <Link to="/" className="btn btn-round">
                Share
              </Link>
            </div>
          </div>
        </div>
      </HeaderLinkArea>
    </HeaderAlt>
  );
}
